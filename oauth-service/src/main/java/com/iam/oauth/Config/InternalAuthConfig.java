package com.iam.oauth.Config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class InternalAuthConfig {

    @Value("${internal.secret}")
    private String internalSecret;

    @Bean
    public RequestInterceptor internalAuthInterceptor() {
        return template -> template.header("X-Internal-Auth", internalSecret);
    }
}
