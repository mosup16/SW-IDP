package com.iam.identity.DTO.IdentityDto;

import com.iam.identity.Enum.Status;

import java.time.OffsetDateTime;
import java.util.UUID;

public record IdentityResponse(UUID id,
                               String email,
                               String displayName,
                               Status status,
                               OffsetDateTime registeredAt,
                               OffsetDateTime lastLoginAt) {
}
