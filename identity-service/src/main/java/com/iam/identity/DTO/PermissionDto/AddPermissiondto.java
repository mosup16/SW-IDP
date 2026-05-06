package com.iam.identity.DTO.PermissionDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddPermissiondto(
        @NotBlank(message = "Code is required")
        @Pattern(regexp = "^[A-Z]+:[A-Z]+$", message = "Code must be in format RESOURCE:ACTION (e.g. USER:READ)")
        String code,

        @NotBlank(message = "Resource is required")
        String resource,

        @NotBlank(message = "Action is required")
        String action,

        @Size(max = 255, message = "Description too long")
        String description
) {
}
