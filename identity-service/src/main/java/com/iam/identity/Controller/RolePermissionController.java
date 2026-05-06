package com.iam.identity.Controller;

import com.iam.identity.DTO.RolePermissionDto.AddRolePermissiondto;
import com.iam.identity.DTO.RolePermissionDto.AllRolePermission;
import com.iam.identity.Service.Interface.RolePermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/role-permissions")
@RequiredArgsConstructor
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    @PostMapping
    public ResponseEntity<String> assign(@Valid @RequestBody AddRolePermissiondto request) {
        return ResponseEntity.ok(rolePermissionService.AssignPermissionToRole(request));
    }

    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<String> remove(@PathVariable UUID roleId, @PathVariable UUID permissionId) {
        return ResponseEntity.ok(rolePermissionService.RemovePermissionFromRole(roleId, permissionId));
    }

    @GetMapping("/{roleId}/permissions")
    public ResponseEntity<List<AllRolePermission>> getByRole(@PathVariable UUID roleId) {
        return ResponseEntity.ok(rolePermissionService.GetPermissionsByRole(roleId));
    }
}