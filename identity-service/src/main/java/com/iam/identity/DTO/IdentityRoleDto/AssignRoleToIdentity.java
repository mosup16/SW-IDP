package com.iam.identity.DTO.IdentityRoleDto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignRoleToIdentity(

        @NotNull(message = "Identity ID is required")
        UUID identityId,

        @NotNull(message = "Role ID is required")
        UUID roleId,

        UUID assignedBy
) {
}
