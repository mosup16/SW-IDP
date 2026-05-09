package com.iam.oauth.Service.Impl;

import com.iam.oauth.Client.IdentityClient;
import com.iam.oauth.Config.JwtProperties;
import com.iam.oauth.Config.JwtSigner;
import com.iam.oauth.DTO.Internal.ClaimsResponse;
import com.iam.oauth.DTO.Token.TokenResponse;
import com.iam.oauth.Entity.AccessToken;
import com.iam.oauth.Entity.AuthorizationCode;
import com.iam.oauth.Entity.ClientApplication;
import com.iam.oauth.Entity.RefreshToken;
import com.iam.oauth.Enum.Status;
import com.iam.oauth.Exception.OAuthException;
import com.iam.oauth.Repository.AccessTokenRepository;
import com.iam.oauth.Repository.ClientAppRepository;
import com.iam.oauth.Repository.RefreshTokenRepository;
import com.iam.oauth.Service.Interface.AuthorizationCodeService;
import com.iam.oauth.Service.Interface.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final ClientAppRepository clientRepo;
    private final AuthorizationCodeService codeService;
    private final AccessTokenRepository accessTokenRepo;
    private final RefreshTokenRepository refreshTokenRepo;
    private final IdentityClient identityClient;
    private final JwtSigner jwtSigner;
    private final JwtProperties jwtProps;
    private final PasswordEncoder passwordEncoder;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    public TokenResponse authorizationCodeGrant(String clientId, String clientSecret,
                                                 String code, String redirectUri) {
        ClientApplication client = validateClient(clientId, clientSecret);
        AuthorizationCode authCode = codeService.consumeAndValidate(code, clientId, redirectUri);
        return mintTokenPair(client, authCode.getIdentityId());
    }

    @Override
    @Transactional
    public TokenResponse refreshTokenGrant(String clientId, String clientSecret, String refreshTokenValue) {
        ClientApplication client = validateClient(clientId, clientSecret);

        String hash = sha256(refreshTokenValue);
        RefreshToken rt = refreshTokenRepo.findByTokenHashAndUsedAtIsNullAndRevokedAtIsNull(hash)
                .orElseThrow(() -> OAuthException.invalidGrant("invalid refresh token"));

        if (rt.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw OAuthException.invalidGrant("refresh token expired");
        }

        if (!rt.getClientId().equals(clientId)) {
            throw OAuthException.invalidGrant("token not issued to this client");
        }

        rt.setUsedAt(OffsetDateTime.now());
        refreshTokenRepo.save(rt);

        AccessToken oldAt = accessTokenRepo.findByJti(rt.getJti()).orElse(null);
        if (oldAt != null) {
            oldAt.setRevokedAt(OffsetDateTime.now());
            accessTokenRepo.save(oldAt);
        }

        return mintTokenPair(client, rt.getIdentityId());
    }

    private ClientApplication validateClient(String clientId, String clientSecret) {
        ClientApplication client = clientRepo.findById(clientId)
                .orElseThrow(() -> OAuthException.invalidClient("unknown client"));

        if (!passwordEncoder.matches(clientSecret, client.getClientSecretHash())) {
            throw OAuthException.invalidClient("invalid client secret");
        }

        if (client.getStatus() != Status.ACTIVE) {
            throw OAuthException.invalidClient("client is disabled");
        }

        return client;
    }

    private TokenResponse mintTokenPair(ClientApplication client, UUID identityId) {
        ClaimsResponse claims = identityClient.getClaims(identityId);

        try {
            Duration atTtl = Duration.ofMinutes(jwtProps.getAccessTokenTtlMins());
            JwtSigner.SignResult at = jwtSigner.sign(
                    identityId, claims.email(), claims.roles(), claims.permissions(),
                    client.getClientId(), atTtl);

            AccessToken accessToken = AccessToken.builder()
                    .jti(at.jti())
                    .clientApplication(client)
                    .identityId(identityId)
                    .issuedAt(OffsetDateTime.ofInstant(at.issuedAt(), java.time.ZoneOffset.UTC))
                    .expiresAt(OffsetDateTime.ofInstant(at.expiresAt(), java.time.ZoneOffset.UTC))
                    .build();
            accessTokenRepo.save(accessToken);

            byte[] rtBytes = new byte[32];
            RANDOM.nextBytes(rtBytes);
            String plainRefreshToken = Base64.getUrlEncoder().withoutPadding().encodeToString(rtBytes);
            String rtHash = sha256(plainRefreshToken);

            RefreshToken refreshToken = RefreshToken.builder()
                    .jti(at.jti())
                    .clientId(UUID.fromString(client.getClientId()))
                    .identityId(identityId)
                    .tokenHash(rtHash)
                    .issuedAt(OffsetDateTime.ofInstant(at.issuedAt(), java.time.ZoneOffset.UTC))
                    .expiresAt(OffsetDateTime.now().plusDays(jwtProps.getRefreshTokenTtlDays()))
                    .build();
            refreshTokenRepo.save(refreshToken);

            return new TokenResponse(
                    at.token(), "Bearer", atTtl.toSeconds(), plainRefreshToken, at.token());

        } catch (Exception e) {
            throw new RuntimeException("Token signing failed", e);
        }
    }

    private String sha256(String value) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] bytes = md.digest(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(bytes);
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
