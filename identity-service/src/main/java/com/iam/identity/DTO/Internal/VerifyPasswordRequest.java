package com.iam.identity.DTO.Internal;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerifyPasswordRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {}
