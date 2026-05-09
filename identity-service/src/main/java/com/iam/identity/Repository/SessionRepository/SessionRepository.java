package com.iam.identity.Repository.SessionRepository;

import com.iam.identity.Entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {
    Optional<Session> findByTokenHashAndRevokedAtIsNull(String tokenHash);
    List<Session> findByIdentityIdAndRevokedAtIsNull(UUID identityId);
}
