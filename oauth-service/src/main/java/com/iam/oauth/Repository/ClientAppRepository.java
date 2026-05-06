package com.iam.oauth.Repository;

import com.iam.oauth.Entity.ClientApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ClientAppRepository extends JpaRepository<ClientApplication, String> {
    boolean existsByClientId(String clientId);

}
