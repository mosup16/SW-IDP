package com.iam.admin.DTOs;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AuditLogResponse(
        UUID id,
        OffsetDateTime timestampUtc,
        UUID actorId,
        String action,
        String targetType,
        String targetId,
        String status,
        String ipAddress,
        String metadata
) {}
