package com.iam.identity.Repository.IdentityRoleRepository;

import com.iam.identity.Entity.IdentityRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IdentityRoleRepository extends JpaRepository<IdentityRole, UUID> {
    List<IdentityRole> findByIdentityId(UUID identityId);
    List<IdentityRole> findByRoleId(UUID roleId);
    boolean existsByIdentityIdAndRoleId(UUID identityId, UUID roleId);
    void deleteByIdentityIdAndRoleId(UUID identityId, UUID roleId);
    Optional<IdentityRole> findByIdentityIdAndRoleId(UUID identityId, UUID roleId);

    @Query("SELECT ir FROM IdentityRole ir JOIN FETCH ir.role WHERE ir.identity.id = :identityId")
    List<IdentityRole> findByIdentityIdWithRoles(@Param("identityId") UUID identityId);
}
