package com.iam.admin.DTOs;

import com.iam.admin.Enum.Type;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UpdateSettingDto(
        @NotBlank(message = "Value is required")
        String value,

        @NotNull(message = "Type is required")
        Type type,

        @NotNull(message = "Updated by user ID is required")
         UUID UpdatedBy

) {}