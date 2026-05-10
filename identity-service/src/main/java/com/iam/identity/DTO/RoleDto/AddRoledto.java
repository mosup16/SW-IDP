package com.iam.identity.DTO.RoleDto;

import com.iam.identity.Enum.Type;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AddRoledto(

        @NotBlank(message = "Role name is required")
        @Size(min = 2, max = 50, message = "Role name must be between 2 and 50 characters")
        String name,

        @Size(max = 255, message = "Description too long")
        String description,

        @NotNull(message = "Role type is required")
        Type type,

        List<String> permissionCodes


) {
}
