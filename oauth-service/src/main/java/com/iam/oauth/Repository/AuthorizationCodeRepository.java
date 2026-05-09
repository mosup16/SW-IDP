package com.iam.oauth.Repository;

import com.iam.oauth.Entity.AuthorizationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthorizationCodeRepository extends JpaRepository<AuthorizationCode, String> {
    Optional<AuthorizationCode> findByCodeAndUsedAtIsNull(String code);
}
