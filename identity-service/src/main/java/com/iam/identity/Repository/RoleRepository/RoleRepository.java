package com.iam.identity.Repository.RoleRepository;

import com.iam.identity.Entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    boolean existsByName(String name);
    Optional<Role> findById(UUID roleId);
    Optional<Role> findByName(String name);
}
