package com.iam.oauth.Config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String privateKeyPath;
    private String publicKeyPath;
    private String issuer;
    private int accessTokenTtlMins = 60;
    private int refreshTokenTtlDays = 30;
}
