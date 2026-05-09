package com.iam.oauth.Service.Interface;

import com.iam.oauth.DTO.Token.TokenResponse;

public interface TokenService {
    TokenResponse authorizationCodeGrant(String clientId, String clientSecret, String code, String redirectUri);
    TokenResponse refreshTokenGrant(String clientId, String clientSecret, String refreshToken);
}
