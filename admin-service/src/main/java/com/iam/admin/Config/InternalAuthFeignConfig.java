package com.iam.admin.Config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class InternalAuthFeignConfig {

    @Value("${internal.secret}")
    private String internalSecret;

    @Bean
    public RequestInterceptor internalAuthInterceptor() {
        return template -> template.header("X-Internal-Auth", internalSecret);
    }
}
