package com.iam.identity.DTO.Internal;

import java.util.UUID;

public record VerifyPasswordResponse(
        UUID identityId,
        String email,
        String status
) {}
