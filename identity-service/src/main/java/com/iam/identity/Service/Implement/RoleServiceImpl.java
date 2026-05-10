package com.iam.identity.Service.Implement;

import com.iam.identity.Audit.Audited;
import com.iam.identity.DTO.RoleDto.AddRoledto;
import com.iam.identity.DTO.RoleDto.RoleResponse;
import com.iam.identity.Entity.Permission;
import com.iam.identity.Entity.Role;
import com.iam.identity.Entity.RolePermission;
import com.iam.identity.Repository.PermissionRepository.PermissionRepository;
import com.iam.identity.Repository.RolePermissionRepository.RolePermissionRepository;
import com.iam.identity.Repository.RoleRepository.RoleRepository;
import com.iam.identity.Service.Interface.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    @Transactional
    @Audited(action = "ROLE_CREATED", targetType = "ROLE", targetIdExpr = "#result.id")
    public RoleResponse AddRole(AddRoledto request) {
        if (roleRepository.existsByName(request.name())) {
            throw new RuntimeException("Role already exists");
        }

        Role role = Role.builder()
                .name(request.name())
                .description(request.description())
                .type(request.type())
                .createdAt(OffsetDateTime.now())
                .lastModifiedAt(OffsetDateTime.now())
                .build();

        Role saved = roleRepository.save(role);
        if (request.permissionCodes() != null) {
            syncPermissions(saved, request.permissionCodes());
        }
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> GetAll() {
        return roleRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse GetById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return toResponse(role);
    }

    @Override
    @Transactional
    @Audited(action = "ROLE_UPDATED", targetType = "ROLE", targetIdExpr = "#args[0]")
    public String Update(UUID id, AddRoledto request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        if (!role.getName().equals(request.name()) && roleRepository.existsByName(request.name())) {
            throw new RuntimeException("Role name already exists");
        }

        role.setName(request.name());
        role.setDescription(request.description());
        role.setType(request.type());
        role.setLastModifiedAt(OffsetDateTime.now());

        if (request.permissionCodes() != null) {
            syncPermissions(role, request.permissionCodes());
        }

        return "Role updated successfully";
    }

    @Override
    @Transactional
    @Audited(action = "ROLE_DELETED", targetType = "ROLE", targetIdExpr = "#args[0]")
    public String Delete(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        roleRepository.delete(role);
        return "Role deleted successfully";
    }

    private void syncPermissions(Role role, List<String> desiredCodes) {
        Set<String> desired = new HashSet<>(desiredCodes);
        List<RolePermission> current = rolePermissionRepository.findByRoleId(role.getId());

        Set<String> currentCodes = new HashSet<>();
        for (RolePermission rp : current) {
            String code = rp.getPermission().getCode();
            currentCodes.add(code);
            if (!desired.contains(code)) {
                rolePermissionRepository.deleteByRoleIdAndPermissionId(role.getId(), rp.getPermission().getId());
            }
        }

        for (String code : desired) {
            if (currentCodes.contains(code)) continue;
            Permission permission = permissionRepository.findByCode(code).orElse(null);
            if (permission == null) continue;
            rolePermissionRepository.save(RolePermission.builder()
                    .role(role)
                    .permission(permission)
                    .build());
        }
    }

    private RoleResponse toResponse(Role role) {
        return new RoleResponse(
                role.getId(),
                role.getName(),
                role.getDescription(),
                role.getType(),
                role.getCreatedAt(),
                role.getLastModifiedAt()
        );
    }
}
