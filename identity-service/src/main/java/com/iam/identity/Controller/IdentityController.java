package com.iam.identity.Controller;

import com.iam.identity.DTO.IdentityDto.*;
import com.iam.identity.Service.Interface.IdentityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/identities")
@RequiredArgsConstructor
public class IdentityController {

    private final IdentityService identityService;

    // ✅ GET /api/v1/identities
    @GetMapping
    public ResponseEntity<IdentityListResponse> getAllIdentities() {
        return ResponseEntity.ok(identityService.getAllIdentities());
    }

    // ✅ POST /api/v1/identities
    @PostMapping
    public ResponseEntity<IdentityResponse> createIdentity(
            @Valid @RequestBody CreateIdentityRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(identityService.createIdentity(request));
    }

    // ✅ GET /api/v1/identities/{id}
    @GetMapping("/{id}")
    public ResponseEntity<IdentityResponse> getIdentityById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(identityService.getIdentityById(id));
    }

    // ✅ PUT /api/v1/identities/{id}
    @PutMapping("/{id}")
    public ResponseEntity<IdentityResponse> updateIdentity(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIdentityRequest request
    ) {
        return ResponseEntity.ok(identityService.updateIdentity(id, request));
    }

    // ✅ DELETE /api/v1/identities/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIdentity(
            @PathVariable UUID id
    ) {
        identityService.deleteIdentity(id);
        return ResponseEntity.noContent().build();
    }
}