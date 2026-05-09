package com.iam.identity.Service.Interface;

import com.iam.identity.DTO.Internal.ClaimsResponse;

import java.util.UUID;

public interface IdentityClaimsService {
    ClaimsResponse getClaims(UUID identityId);
}
