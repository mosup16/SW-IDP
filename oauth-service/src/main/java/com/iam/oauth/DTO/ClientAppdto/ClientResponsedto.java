package com.iam.oauth.DTO.ClientAppdto;

import com.iam.oauth.Enum.Status;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ClientResponsedto(
        String clientId,
        String name,
        String description,
        Status status,
        OffsetDateTime createdAt,
        OffsetDateTime secretRotatedAt,
        UUID createdBy,
        List<String> redirectUris
) {}