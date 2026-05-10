package com.iam.identity.Repository.PermissionRepository;

import com.iam.identity.Entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PermissionRepository extends JpaRepository<Permission, UUID> {
    boolean existsByCode(String code);
    Optional<Permission> findByCode(String code);
}
