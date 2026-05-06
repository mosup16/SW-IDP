package com.iam.oauth.DTO.ClientAppdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RotateSecretdto(
        @NotBlank(message = "New secret is required")
                                    @Size(min = 8, message = "Secret must be at least 8 characters")
                                    String newSecret)
{
}
