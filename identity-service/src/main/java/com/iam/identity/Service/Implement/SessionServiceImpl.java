package com.iam.identity.Service.Implement;

import com.iam.identity.DTO.Internal.SessionPrincipal;
import com.iam.identity.Entity.Identity;
import com.iam.identity.Entity.IdentityRole;
import com.iam.identity.Entity.Session;
import com.iam.identity.Repository.AuthenticationRepository.AuthRepository;
import com.iam.identity.Repository.IdentityRoleRepository.IdentityRoleRepository;
import com.iam.identity.Repository.SessionRepository.SessionRepository;
import com.iam.identity.Service.Interface.SessionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final AuthRepository authRepository;
    private final IdentityRoleRepository identityRoleRepository;

    @Override
    @Transactional
    public Session createSession(UUID identityId, String plainToken, String userAgent, String ipAddress) {
        Identity identity = authRepository.findById(identityId)
                .orElseThrow(() -> new EntityNotFoundException("Identity not found"));

        Session session = Session.builder()
                .identity(identity)
                .tokenHash(hash(plainToken))
                .userAgent(userAgent)
                .ipAddress(ipAddress)
                .createdAt(OffsetDateTime.now())
                .lastActiveAt(OffsetDateTime.now())
                .expiresAt(OffsetDateTime.now().plusDays(30))
                .isCurrent(true)
                .build();

        return sessionRepository.save(session);
    }

    @Override
    @Transactional
    public SessionPrincipal verifySession(String plainToken) {
        Session session = sessionRepository.findByTokenHashAndRevokedAtIsNull(hash(plainToken))
                .orElseThrow(() -> new SecurityException("Invalid or revoked session"));

        if (session.getExpiresAt() != null && session.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new SecurityException("Session expired");
        }

        session.setLastActiveAt(OffsetDateTime.now());
        sessionRepository.save(session);

        Identity identity = session.getIdentity();
        List<String> roles = identityRoleRepository.findByIdentityIdWithRoles(identity.getId())
                .stream()
                .map(ir -> ir.getRole().getName())
                .toList();

        return new SessionPrincipal(identity.getId(), identity.getEmail(), roles);
    }

    @Override
    @Transactional
    public void revokeSession(UUID sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));
        session.setRevokedAt(OffsetDateTime.now());
        session.setIsCurrent(false);
        sessionRepository.save(session);
    }

    @Override
    @Transactional
    public void revokeAllExcept(UUID identityId, UUID currentSessionId) {
        sessionRepository.findByIdentityIdAndRevokedAtIsNull(identityId).forEach(s -> {
            if (!s.getId().equals(currentSessionId)) {
                s.setRevokedAt(OffsetDateTime.now());
                s.setIsCurrent(false);
                sessionRepository.save(s);
            }
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<Session> listActiveSessions(UUID identityId) {
        return sessionRepository.findByIdentityIdAndRevokedAtIsNull(identityId);
    }

    private String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
