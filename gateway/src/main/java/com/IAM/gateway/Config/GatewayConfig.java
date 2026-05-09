package com.IAM.gateway.Config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("oauth-public", r -> r
                        .path("/oauth/**", "/userinfo", "/.well-known/**")
                        .uri("lb://oauth-service"))
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

    @Bean
    public CorsWebFilter corsFilter() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.addAllowedOrigin("http://localhost:5173");
        cfg.addAllowedMethod("*");
        cfg.addAllowedHeader("*");
        cfg.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return new CorsWebFilter(src);
    }
}