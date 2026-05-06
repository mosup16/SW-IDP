package com.IAM.gateway.Config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("identity-service", r -> r
                        .path("/api/identity/**")
                        .uri("lb://identity-service"))
                .route("oauth-service", r -> r
                        .path("/api/oauth/**")
                        .uri("lb://oauth-service"))
                .route("admin-service", r -> r
                        .path("/api/admin/**")
                        .uri("lb://admin-service"))
                .build();
    }
}