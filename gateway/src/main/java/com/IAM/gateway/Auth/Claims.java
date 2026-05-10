package com.IAM.gateway.Auth;

import java.util.List;
import java.util.UUID;

public record Claims(
        UUID identityId,
        String email,
        List<String> roles,
        List<String> permissions
) {}
