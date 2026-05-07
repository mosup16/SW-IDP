package com.iam.identity.DTO.IdentityRoleDto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record IdentityRoleResponse(UUID id,           // IdentityRole record ID
                                   UUID roleId,
                                   String roleName,   // من الـ Role entity
                                   OffsetDateTime assignedAt,
                                   UUID assignedBy) {
}
