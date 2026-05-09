package com.iam.oauth.Client;

import com.iam.oauth.Config.InternalAuthConfig;
import com.iam.oauth.DTO.Internal.ClaimsResponse;
import com.iam.oauth.DTO.Internal.SessionPrincipal;
import com.iam.oauth.DTO.Internal.VerifyPasswordRequest;
import com.iam.oauth.DTO.Internal.VerifyPasswordResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@FeignClient(name = "identity-client",
             url = "${identity-service.url}",
             configuration = InternalAuthConfig.class)
public interface IdentityClient {

    @PostMapping("/internal/identities/verify-password")
    VerifyPasswordResponse verifyPassword(@RequestBody VerifyPasswordRequest req);

    @GetMapping("/internal/identities/{id}/claims")
    ClaimsResponse getClaims(@PathVariable("id") UUID id);

    @GetMapping("/internal/sessions/verify")
    SessionPrincipal verifySession(@RequestHeader("Cookie") String cookie);
}
