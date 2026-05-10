package com.iam.identity.Service.Implement;

import com.iam.identity.Audit.Audited;
import com.iam.identity.DTO.IdentityRoleDto.AssignRoleToIdentity;
import com.iam.identity.DTO.IdentityRoleDto.IdentityRoleResponse;
import com.iam.identity.DTO.IdentityRoleDto.RemoveRoleFromIdentity;
import com.iam.identity.Entity.Identity;
import com.iam.identity.Entity.IdentityRole;
import com.iam.identity.Entity.Role;

import com.iam.identity.Repository.AuthenticationRepository.AuthRepository;
import com.iam.identity.Repository.IdentityRoleRepository.IdentityRoleRepository;
import com.iam.identity.Repository.RoleRepository.RoleRepository;
import com.iam.identity.Service.Interface.IdentityRoleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IdentityRoleServiceImpl implements IdentityRoleService {

    private final IdentityRoleRepository identityRoleRepository;
    private final AuthRepository authRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    @Audited(action = "ROLE_ASSIGNED", targetType = "IDENTITY_ROLE", targetIdExpr = "#args[0].identityId")
    public IdentityRoleResponse assignRole(AssignRoleToIdentity dto) {
        // 1. تتأكد إن الـ identity موجودة
        Identity identity = authRepository.findById(dto.identityId())
                .orElseThrow(() -> new EntityNotFoundException("Identity not found"));

        // 2. تتأكد إن الـ role موجود
        Role role = roleRepository.findById(dto.roleId())
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        // 3. تتأكد إن الـ role مش معين قبل كده
        if (identityRoleRepository.existsByIdentityIdAndRoleId(dto.identityId(), dto.roleId())) {
            throw new IllegalStateException("Role already assigned to this identity");
        }

        // 4. تعمل الـ assign
        IdentityRole identityRole = IdentityRole.builder()
                .identity(identity)
                .role(role)
                .assignedAt(OffsetDateTime.now())
                .assignedBy(dto.assignedBy()) // We Will Get It From JWT
                .build();

        IdentityRole saved = identityRoleRepository.save(identityRole);

        return toResponse(saved);
    }

    @Override
    @Transactional
    @Audited(action = "ROLE_REMOVED", targetType = "IDENTITY_ROLE", targetIdExpr = "#args[0].identityId")
    public void removeRole(RemoveRoleFromIdentity dto) {
        // 1. تتأكد إن الـ record موجود أصلاً
        if (!identityRoleRepository.existsByIdentityIdAndRoleId(dto.identityId(), dto.roleId())) {
            throw new EntityNotFoundException("Role is not assigned to this identity");
        }


        // We Will Excute Some Condtion Before Deleteing

        // 2. تمسحه
        identityRoleRepository.deleteByIdentityIdAndRoleId(dto.identityId(), dto.roleId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IdentityRoleResponse> getIdentityRoles(UUID identityId) {
        // 1. تتأكد إن الـ identity موجودة
        if (!authRepository.existsById(identityId)) {
            throw new EntityNotFoundException("Identity not found");
        }

        // 2. ترجع الـ roles مع JOIN FETCH عشان تتجنب N+1
        return identityRoleRepository.findByIdentityIdWithRoles(identityId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ✅ Helper method لتحويل الـ Entity لـ Response DTO
    private IdentityRoleResponse toResponse(IdentityRole ir) {
        return new IdentityRoleResponse(
                ir.getId(),
                ir.getRole().getId(),
                ir.getRole().getName(),
                ir.getAssignedAt(),
                ir.getAssignedBy()
        );
    }
}