package com.iam.identity.DTO.Internal;

import java.util.List;
import java.util.UUID;

public record SessionPrincipal(
        UUID identityId,
        String email,
        List<String> roles
) {}
