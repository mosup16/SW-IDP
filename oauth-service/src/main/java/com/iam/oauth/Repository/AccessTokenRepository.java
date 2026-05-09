package com.iam.oauth.Repository;

import com.iam.oauth.Entity.AccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccessTokenRepository extends JpaRepository<AccessToken, String> {
    Optional<AccessToken> findByJti(String jti);
}
