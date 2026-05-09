package com.iam.oauth.Controller;

import com.iam.oauth.DTO.Token.TokenResponse;
import com.iam.oauth.Exception.OAuthException;
import com.iam.oauth.Service.Interface.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class TokenController {

    private final TokenService tokenService;

    @PostMapping(value = "/oauth/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public TokenResponse token(@RequestParam("grant_type") String grantType,
                               @RequestParam("client_id") String clientId,
                               @RequestParam("client_secret") String clientSecret,
                               @RequestParam(value = "code", required = false) String code,
                               @RequestParam(value = "redirect_uri", required = false) String redirectUri,
                               @RequestParam(value = "refresh_token", required = false) String refreshToken) {

        return switch (grantType) {
            case "authorization_code" -> tokenService.authorizationCodeGrant(clientId, clientSecret, code, redirectUri);
            case "refresh_token" -> tokenService.refreshTokenGrant(clientId, clientSecret, refreshToken);
            default -> throw OAuthException.unsupportedGrantType();
        };
    }
}
