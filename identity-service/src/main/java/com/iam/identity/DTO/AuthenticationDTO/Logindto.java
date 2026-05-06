package com.iam.identity.DTO.AuthenticationDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record Logindto
        (  @NotBlank @Email String email,
           @NotBlank String password)

{
}
