package com.iam.identity.Service.Interface;

import com.iam.identity.DTO.Internal.SessionPrincipal;
import com.iam.identity.Entity.Session;

import java.util.List;
import java.util.UUID;

public interface SessionService {
    Session createSession(UUID identityId, String plainToken, String userAgent, String ipAddress);
    SessionPrincipal verifySession(String plainToken);
    void revokeSession(UUID sessionId);
    void revokeAllExcept(UUID identityId, UUID currentSessionId);
    List<Session> listActiveSessions(UUID identityId);
}
