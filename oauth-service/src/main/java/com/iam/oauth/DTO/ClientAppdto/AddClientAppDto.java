package com.iam.oauth.DTO.ClientAppdto;

import com.iam.oauth.Enum.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AddClientAppDto(
        @NotBlank(message = "Client ID is required")
                                String clientId,
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description,

        @NotBlank(message = "Client secret is required")
        String clientSecret



)


{
}
