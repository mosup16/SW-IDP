package com.iam.identity.DTO.IdentityDto;

import java.util.List;

public record IdentityListResponse(List<IdentityResponse> identities,
                                   long totalUsers,
                                   long activeNow) {
}
