package com.iam.identity.DTO.PermissionDto;

import java.util.UUID;

public record AllPermissiondto(
        UUID id,
         String code,
        String resource,
        String action,
        String description) {
}
