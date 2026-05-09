package com.iam.oauth.Config;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Component
public class JwtSigner {

    private static final String KID = "dev-key-001";

    private final RSASSASigner signer;
    @Getter
    private final RSAPublicKey publicKey;
    private final JwtProperties props;

    public JwtSigner(JwtProperties props) throws Exception {
        this.props = props;
        RSAPrivateKey privateKey = loadPrivateKey(props.getPrivateKeyPath());
        this.publicKey = loadPublicKey(props.getPublicKeyPath());
        this.signer = new RSASSASigner(privateKey);
    }

    public record SignResult(String jti, String token, Instant issuedAt, Instant expiresAt) {}

    public SignResult sign(UUID identityId, String email, List<String> roles,
                          List<String> permissions, String clientId, java.time.Duration ttl) throws Exception {
        Instant now = Instant.now();
        Instant exp = now.plus(ttl);
        String jti = UUID.randomUUID().toString();

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .jwtID(jti)
                .subject(identityId.toString())
                .issuer(props.getIssuer())
                .issueTime(Date.from(now))
                .expirationTime(Date.from(exp))
                .claim("email", email)
                .claim("roles", roles)
                .claim("permissions", permissions)
                .claim("client_id", clientId)
                .build();

        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256).keyID(KID).build();
        SignedJWT jwt = new SignedJWT(header, claims);
        jwt.sign(signer);

        return new SignResult(jti, jwt.serialize(), now, exp);
    }

    private RSAPrivateKey loadPrivateKey(String path) throws Exception {
        String pem = new String(Files.readAllBytes(Paths.get(path)))
                .replaceAll("-----.*-----", "").replaceAll("\\s", "");
        byte[] der = Base64.getDecoder().decode(pem);
        return (RSAPrivateKey) KeyFactory.getInstance("RSA")
                .generatePrivate(new PKCS8EncodedKeySpec(der));
    }

    private RSAPublicKey loadPublicKey(String path) throws Exception {
        String pem = new String(Files.readAllBytes(Paths.get(path)))
                .replaceAll("-----.*-----", "").replaceAll("\\s", "");
        byte[] der = Base64.getDecoder().decode(pem);
        return (RSAPublicKey) KeyFactory.getInstance("RSA")
                .generatePublic(new X509EncodedKeySpec(der));
    }
}
