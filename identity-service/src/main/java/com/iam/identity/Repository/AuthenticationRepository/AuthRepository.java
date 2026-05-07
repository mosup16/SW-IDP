package com.iam.identity.Repository.AuthenticationRepository;

import com.iam.identity.Entity.Identity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthRepository extends JpaRepository<Identity, UUID> {

    boolean existsByEmail(String email);

    Optional<Identity> findByEmail(String email);


}
