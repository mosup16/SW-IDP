package com.iam.identity.Repository.IdentityRepository;

import com.iam.identity.Entity.Identity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface IdentityRepository extends JpaRepository<Identity, UUID> {
    Optional<Identity> findByEmail(String email);
    boolean existsByEmail(String email);
    @Query("SELECT COUNT(i) FROM Identity i WHERE i.status = Status.ENABLED ")
    long countEnabledIdentities();
}
