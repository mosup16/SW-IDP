package com.iam.identity.DTO.AuthenticationDTO;

import java.util.UUID;

public record LoginSuccessResponse(
        UUID identityId,
        String email,
        String sessionToken
) {}
