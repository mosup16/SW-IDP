package com.iam.identity.Controller;

import com.iam.identity.DTO.IdentityRoleDto.AssignRoleToIdentity;
import com.iam.identity.DTO.IdentityRoleDto.IdentityRoleResponse;
import com.iam.identity.DTO.IdentityRoleDto.RemoveRoleFromIdentity;
import com.iam.identity.Service.Interface.IdentityRoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/identity-roles")
@RequiredArgsConstructor
public class IdentityRoleController {

    private final IdentityRoleService identityRoleService;

    // ✅ Assign role to identity
    @PostMapping("/assign")
    public ResponseEntity<IdentityRoleResponse> assignRole(
            @Valid @RequestBody AssignRoleToIdentity dto
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(identityRoleService.assignRole(dto));
    }

    // ✅ Remove role from identity
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeRole(
            @Valid @RequestBody RemoveRoleFromIdentity dto
    ) {
        identityRoleService.removeRole(dto);
        return ResponseEntity.noContent().build();
    }

    // ✅ Get all roles of an identity
    @GetMapping("/{identityId}/roles")
    public ResponseEntity<List<IdentityRoleResponse>> getIdentityRoles(
            @PathVariable UUID identityId
    ) {
        return ResponseEntity.ok(identityRoleService.getIdentityRoles(identityId));
    }
}