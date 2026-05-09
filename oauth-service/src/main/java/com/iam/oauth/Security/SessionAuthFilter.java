package com.iam.oauth.Security;

import com.iam.oauth.Client.IdentityClient;
import com.iam.oauth.DTO.Internal.SessionPrincipal;
import feign.FeignException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class SessionAuthFilter extends OncePerRequestFilter {

    private final IdentityClient identityClient;

    private final Map<String, CachedPrincipal> cache = new ConcurrentHashMap<>();

    private record CachedPrincipal(SessionPrincipal principal, long expiresMs) {}

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String token = extractSessionCookie(request);
        if (token != null) {
            SessionPrincipal principal = resolve(token);
            if (principal != null) {
                List<SimpleGrantedAuthority> authorities = principal.roles().stream()
                        .map(r -> new SimpleGrantedAuthority("ROLE_" + r.toUpperCase().replace(' ', '_')))
                        .toList();
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(principal, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }

    private SessionPrincipal resolve(String token) {
        long now = System.currentTimeMillis();
        CachedPrincipal cached = cache.get(token);
        if (cached != null && cached.expiresMs() > now) {
            return cached.principal();
        }
        try {
            SessionPrincipal principal = identityClient.verifySession("SESSION=" + token);
            cache.put(token, new CachedPrincipal(principal, now + 30_000));
            return principal;
        } catch (FeignException e) {
            return null;
        }
    }

    private String extractSessionCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> "SESSION".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
