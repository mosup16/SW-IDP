package com.iam.identity.DTO.RolePermissionDto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AddRolePermissiondto(
        @NotNull(message = "Role ID is required")
        UUID roleId,
         @NotNull(message = "Permission ID is required")
         UUID permissionId) {
}
