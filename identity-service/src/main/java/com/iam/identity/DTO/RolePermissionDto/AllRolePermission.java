package com.iam.identity.DTO.RolePermissionDto;

import java.util.UUID;

public record AllRolePermission(
        UUID id,
        UUID roleId,
        String roleName,
        UUID permissionId,
        String permissionCode,
        String resource,
        String action
) {
}
