package com.iam.identity.DTO.IdentityDto;

import com.iam.identity.Enum.Status;

public record UpdateIdentityRequest(String displayName,
                                    Status status) {
}
