package com.iam.admin.DTOs;

import com.iam.admin.Enum.Type;

import java.time.OffsetDateTime;
import java.util.UUID;

public record GetsettingsDto(
        String key,
        String value,
        Type type,
         OffsetDateTime updatedAt,
         UUID updatedBy) {
}
