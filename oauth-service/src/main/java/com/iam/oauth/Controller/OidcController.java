package com.iam.oauth.Controller;

import com.iam.oauth.Config.JwtProperties;
import com.iam.oauth.Config.JwtSigner;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OidcController {

    private final JwtSigner jwtSigner;
    private final JwtProperties jwtProps;

    @GetMapping("/.well-known/openid-configuration")
    public Map<String, Object> discovery() {
        String issuer = jwtProps.getIssuer();
        return Map.of(
                "issuer", issuer,
                "authorization_endpoint", issuer + "/oauth/authorize",
                "token_endpoint", issuer + "/oauth/token",
                "userinfo_endpoint", issuer + "/userinfo",
                "jwks_uri", issuer + "/.well-known/jwks.json",
                "response_types_supported", new String[]{"code"},
                "grant_types_supported", new String[]{"authorization_code", "refresh_token"},
                "subject_types_supported", new String[]{"public"},
                "id_token_signing_alg_values_supported", new String[]{"RS256"}
        );
    }

    @GetMapping(value = "/.well-known/jwks.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public String jwks() throws Exception {
        RSAKey rsaKey = new RSAKey.Builder(jwtSigner.getPublicKey())
                .keyUse(KeyUse.SIGNATURE)
                .keyID("dev-key-001")
                .build();
        return new JWKSet(rsaKey).toPublicJWKSet().toString();
    }
}
