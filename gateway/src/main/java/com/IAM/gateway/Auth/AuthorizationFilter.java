package com.IAM.gateway.Auth;

import com.IAM.gateway.Auth.AuthorityRules.Decision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
public class AuthorizationFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(AuthorizationFilter.class);

    private final AuthorityRules rules;
    private final WebClient identityClient;
    private final String internalSecret;

    public AuthorizationFilter(AuthorityRules rules,
                               WebClient identityClient,
                               @Value("${internal.secret}") String internalSecret) {
        this.rules = rules;
        this.identityClient = identityClient;
        this.internalSecret = internalSecret;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        var request = exchange.getRequest();
        String path = request.getPath().value();
        HttpMethod method = request.getMethod();

        if (HttpMethod.OPTIONS.equals(method)) return chain.filter(exchange);

        Decision decision = rules.decide(path, method);

        switch (decision.kind()) {
            case DENY:
                return reject(exchange, HttpStatus.NOT_FOUND, "not_found");
            case PUBLIC:
                return chain.filter(exchange);
            case AUTHENTICATED:
            case AUTHORITY:
            default:
                return enforceAuth(exchange, chain, decision);
        }
    }

    private Mono<Void> enforceAuth(ServerWebExchange exchange, GatewayFilterChain chain, Decision decision) {
        HttpCookie sessionCookie = exchange.getRequest().getCookies().getFirst("SESSION");
        if (sessionCookie == null || sessionCookie.getValue().isBlank()) {
            return reject(exchange, HttpStatus.UNAUTHORIZED, "missing_session");
        }
        String token = sessionCookie.getValue();

        return identityClient.get()
                .uri("/internal/sessions/verify")
                .header("X-Internal-Auth", internalSecret)
                .cookie("SESSION", token)
                .retrieve()
                .bodyToMono(Claims.class)
                .flatMap(claims -> {
                    if (decision.kind() == Decision.Kind.AUTHENTICATED) {
                        return chain.filter(exchange);
                    }
                    String required = decision.authority();
                    if (claims.permissions() != null && claims.permissions().contains(required)) {
                        return chain.filter(exchange);
                    }
                    log.debug("Missing authority {} for {}", required, exchange.getRequest().getPath());
                    return reject(exchange, HttpStatus.FORBIDDEN, "missing_authority:" + required);
                })
                .onErrorResume(WebClientResponseException.class, ex -> {
                    if (ex.getStatusCode().value() == 401) {
                        return reject(exchange, HttpStatus.UNAUTHORIZED, "invalid_session");
                    }
                    log.warn("Identity-service returned {} during session verify", ex.getStatusCode());
                    return reject(exchange, HttpStatus.SERVICE_UNAVAILABLE, "auth_unavailable");
                })
                .onErrorResume(ex -> {
                    log.warn("Identity-service unreachable during session verify: {}", ex.getMessage());
                    return reject(exchange, HttpStatus.SERVICE_UNAVAILABLE, "auth_unavailable");
                });
    }

    private Mono<Void> reject(ServerWebExchange exchange, HttpStatus status, String error) {
        var response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] body = ("{\"error\":\"" + error + "\"}").getBytes(StandardCharsets.UTF_8);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body)));
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
