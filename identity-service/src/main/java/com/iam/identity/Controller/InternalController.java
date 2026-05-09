package com.iam.identity.Controller;

import com.iam.identity.DTO.Internal.ClaimsResponse;
import com.iam.identity.DTO.Internal.VerifyPasswordRequest;
import com.iam.identity.DTO.Internal.VerifyPasswordResponse;
import com.iam.identity.Entity.Identity;
import com.iam.identity.Enum.Status;
import com.iam.identity.Repository.AuthenticationRepository.AuthRepository;
import com.iam.identity.Service.Interface.IdentityClaimsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/internal/identities")
@RequiredArgsConstructor
public class InternalController {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final IdentityClaimsService claimsService;

    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPassword(@Valid @RequestBody VerifyPasswordRequest req) {
        Identity identity = authRepository.findByEmail(req.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(req.password(), identity.getPasswordHash())) {
            return ResponseEntity.status(401).body("{\"error\":\"invalid_credentials\"}");
        }

        if (identity.getStatus() == Status.DISABLED) {
            return ResponseEntity.status(403).body("{\"error\":\"account_disabled\"}");
        }

        return ResponseEntity.ok(new VerifyPasswordResponse(
                identity.getId(), identity.getEmail(), identity.getStatus().name()));
    }

    @GetMapping("/{id}/claims")
    public ResponseEntity<ClaimsResponse> getClaims(@PathVariable UUID id) {
        return ResponseEntity.ok(claimsService.getClaims(id));
    }
}
