package com.iam.oauth.Service.Impl;

import com.iam.oauth.Entity.AuthorizationCode;
import com.iam.oauth.Entity.ClientApplication;
import com.iam.oauth.Exception.OAuthException;
import com.iam.oauth.Repository.AuthorizationCodeRepository;
import com.iam.oauth.Repository.ClientAppRepository;
import com.iam.oauth.Service.Interface.AuthorizationCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthorizationCodeServiceImpl implements AuthorizationCodeService {

    private final AuthorizationCodeRepository codeRepo;
    private final ClientAppRepository clientRepo;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    public String mint(String clientId, UUID identityId, String redirectUri) {
        ClientApplication client = clientRepo.findById(clientId)
                .orElseThrow(() -> OAuthException.invalidClient("unknown client"));

        byte[] bytes = new byte[24];
        RANDOM.nextBytes(bytes);
        String code = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        AuthorizationCode entity = AuthorizationCode.builder()
                .code(code)
                .clientApplication(client)
                .identityId(identityId)
                .redirectUri(redirectUri)
                .issuedAt(OffsetDateTime.now())
                .expiresAt(OffsetDateTime.now().plusMinutes(10))
                .build();

        codeRepo.save(entity);
        return code;
    }

    @Override
    @Transactional
    public AuthorizationCode consumeAndValidate(String code, String clientId, String redirectUri) {
        AuthorizationCode entity = codeRepo.findByCodeAndUsedAtIsNull(code)
                .orElseThrow(() -> OAuthException.invalidGrant("invalid or already-used code"));

        if (entity.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw OAuthException.invalidGrant("code expired");
        }

        if (!entity.getClientApplication().getClientId().equals(clientId)) {
            throw OAuthException.invalidGrant("code not issued to this client");
        }

        if (!entity.getRedirectUri().equals(redirectUri)) {
            throw OAuthException.invalidRedirectUri();
        }

        entity.setUsedAt(OffsetDateTime.now());
        codeRepo.save(entity);
        return entity;
    }
}
