package com.iam.identity.Controller;

import com.iam.identity.DTO.Internal.SessionPrincipal;
import com.iam.identity.Entity.Session;
import com.iam.identity.Service.Interface.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @GetMapping("/api/v1/sessions/me")
    public ResponseEntity<List<Session>> listMySessions(
            @CookieValue(name = "SESSION", required = false) String sessionToken) {
        if (sessionToken == null) return ResponseEntity.status(401).build();
        SessionPrincipal principal = sessionService.verifySession(sessionToken);
        return ResponseEntity.ok(sessionService.listActiveSessions(principal.identityId()));
    }

    @PostMapping("/api/v1/sessions/{sessionId}/revoke")
    public ResponseEntity<Void> revokeSession(@PathVariable UUID sessionId) {
        sessionService.revokeSession(sessionId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/v1/sessions/revoke-all")
    public ResponseEntity<Void> revokeAll(
            @CookieValue(name = "SESSION", required = false) String sessionToken) {
        if (sessionToken == null) return ResponseEntity.status(401).build();
        SessionPrincipal principal = sessionService.verifySession(sessionToken);
        sessionService.revokeAllExcept(principal.identityId(), null);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/internal/sessions/verify")
    public ResponseEntity<?> verifySession(
            @CookieValue(name = "SESSION", required = false) String sessionToken) {
        if (sessionToken == null || sessionToken.isBlank()) {
            return ResponseEntity.status(401).body("{\"error\":\"missing_session\"}");
        }
        try {
            SessionPrincipal principal = sessionService.verifySession(sessionToken);
            return ResponseEntity.ok(principal);
        } catch (SecurityException e) {
            return ResponseEntity.status(401).body("{\"error\":\"invalid_session\"}");
        }
    }
}
