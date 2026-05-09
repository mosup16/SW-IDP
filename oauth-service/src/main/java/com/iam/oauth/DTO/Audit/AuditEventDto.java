package com.iam.oauth.DTO.Audit;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record AuditEventDto(
        Instant timestampUtc,
        UUID actorId,
        String action,
        String targetType,
        String targetId,
        String status,
        String ipAddress,
        Map<String, Object> metadata
) {}
