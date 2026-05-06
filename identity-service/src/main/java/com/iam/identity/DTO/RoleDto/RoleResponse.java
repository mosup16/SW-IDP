package com.iam.identity.DTO.RoleDto;

import com.iam.identity.Enum.Type;

import java.time.OffsetDateTime;
import java.util.UUID;

public record RoleResponse(
        UUID id,
        String name,
        String description,
        Type type,
        OffsetDateTime createdAt,
        OffsetDateTime lastModifiedAt
) {
}
