package com.iam.oauth.Controller;

import com.iam.oauth.Entity.AccessToken;
import com.iam.oauth.Exception.OAuthException;
import com.iam.oauth.Repository.AccessTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserInfoController {

    private final AccessTokenRepository accessTokenRepo;

    @GetMapping("/userinfo")
    public ResponseEntity<Map<String, Object>> userinfo(@AuthenticationPrincipal Jwt jwt) {
        String jti = jwt.getId();
        AccessToken at = accessTokenRepo.findByJti(jti)
                .orElseThrow(() -> OAuthException.invalidGrant("token not found"));

        if (at.getRevokedAt() != null) {
            throw OAuthException.invalidGrant("token revoked");
        }

        if (at.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw OAuthException.invalidGrant("token expired");
        }

        return ResponseEntity.ok(Map.of(
                "sub", jwt.getSubject(),
                "email", jwt.getClaim("email"),
                "roles", jwt.getClaim("roles"),
                "permissions", jwt.getClaim("permissions")
        ));
    }

    @DeleteMapping("/admin/access-tokens/{jti}/revoke")
    public ResponseEntity<Void> revokeToken(@PathVariable String jti) {
        AccessToken at = accessTokenRepo.findByJti(jti)
                .orElseThrow(() -> OAuthException.invalidGrant("token not found"));
        at.setRevokedAt(OffsetDateTime.now());
        accessTokenRepo.save(at);
        return ResponseEntity.noContent().build();
    }
}
