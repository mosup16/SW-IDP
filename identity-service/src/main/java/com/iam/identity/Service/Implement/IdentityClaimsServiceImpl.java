package com.iam.identity.Service.Implement;

import com.iam.identity.DTO.Internal.ClaimsResponse;
import com.iam.identity.Entity.Identity;
import com.iam.identity.Entity.IdentityRole;
import com.iam.identity.Entity.RolePermission;
import com.iam.identity.Repository.AuthenticationRepository.AuthRepository;
import com.iam.identity.Repository.IdentityRoleRepository.IdentityRoleRepository;
import com.iam.identity.Repository.RolePermissionRepository.RolePermissionRepository;
import com.iam.identity.Service.Interface.IdentityClaimsService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IdentityClaimsServiceImpl implements IdentityClaimsService {

    private final AuthRepository authRepository;
    private final IdentityRoleRepository identityRoleRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    @Transactional(readOnly = true)
    public ClaimsResponse getClaims(UUID identityId) {
        Identity identity = authRepository.findById(identityId)
                .orElseThrow(() -> new EntityNotFoundException("Identity not found: " + identityId));

        List<IdentityRole> identityRoles = identityRoleRepository.findByIdentityIdWithRoles(identityId);

        List<String> roles = identityRoles.stream()
                .map(ir -> ir.getRole().getName())
                .toList();

        List<String> permissions = identityRoles.stream()
                .flatMap(ir -> rolePermissionRepository.findByRoleId(ir.getRole().getId()).stream())
                .map(rp -> rp.getPermission().getCode())
                .distinct()
                .toList();

        return new ClaimsResponse(identity.getId(), identity.getEmail(), roles, permissions);
    }
}
