package com.iam.identity.DTO.AuthenticationDTO;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn
) {
    public LoginResponse(String accessToken) {
        this(accessToken, "Bearer", 86400);
    }
}