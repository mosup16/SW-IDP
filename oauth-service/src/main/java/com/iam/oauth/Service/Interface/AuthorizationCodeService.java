package com.iam.oauth.Service.Interface;

import com.iam.oauth.Entity.AuthorizationCode;

import java.util.UUID;

public interface AuthorizationCodeService {
    String mint(String clientId, UUID identityId, String redirectUri);
    AuthorizationCode consumeAndValidate(String code, String clientId, String redirectUri);
}
