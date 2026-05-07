package com.iam.identity.DTO.IdentityDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateIdentityRequest(@NotBlank @Email
                                        String email,

                                    @NotBlank
                                        String password,

                                    String displayName) {
}
