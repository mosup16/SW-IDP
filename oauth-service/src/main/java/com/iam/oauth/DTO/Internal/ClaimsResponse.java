package com.iam.oauth.DTO.Internal;

import java.util.List;
import java.util.UUID;

public record ClaimsResponse(UUID identityId, String email, List<String> roles, List<String> permissions) {}
