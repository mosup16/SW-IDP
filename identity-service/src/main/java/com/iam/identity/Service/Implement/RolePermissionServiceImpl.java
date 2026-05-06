package com.iam.identity.Service.Implement;

import com.iam.identity.DTO.RolePermissionDto.AddRolePermissiondto;
import com.iam.identity.DTO.RolePermissionDto.AllRolePermission;
import com.iam.identity.Entity.Permission;
import com.iam.identity.Entity.Role;
import com.iam.identity.Entity.RolePermission;

import com.iam.identity.Repository.PermissionRepository.PermissionRepository;
import com.iam.identity.Repository.RolePermissionRepository.RolePermissionRepository;
import com.iam.identity.Repository.RoleRepository.RoleRepository;
import com.iam.identity.Service.Interface.RolePermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RolePermissionServiceImpl implements RolePermissionService {

    private final RolePermissionRepository rolePermissionRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public String AssignPermissionToRole(AddRolePermissiondto dto) {
        Role role = roleRepository.findById(dto.roleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Permission permission = permissionRepository.findById(dto.permissionId())
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        if (rolePermissionRepository.existsByRoleIdAndPermissionId(dto.roleId(), dto.permissionId())) {
            throw new RuntimeException("Permission already assigned to this role");
        }

        RolePermission rolePermission = RolePermission.builder()
                .role(role)
                .permission(permission)
                .build();

        rolePermissionRepository.save(rolePermission);
        return "Permission assigned to role successfully";
    }

    @Override
    @Transactional
    public String RemovePermissionFromRole(UUID roleId, UUID permissionId) {
        if (!rolePermissionRepository.existsByRoleIdAndPermissionId(roleId, permissionId)) {
            throw new RuntimeException("Permission not assigned to this role");
        }

        rolePermissionRepository.deleteByRoleIdAndPermissionId(roleId, permissionId);
        return "Permission removed from role successfully";
    }

    @Override
    public List<AllRolePermission> GetPermissionsByRole(UUID roleId) {
        roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        return rolePermissionRepository.findByRoleId(roleId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private AllRolePermission toDto(RolePermission rp) {
        return new AllRolePermission(
                rp.getId(),
                rp.getRole().getId(),
                rp.getRole().getName(),
                rp.getPermission().getId(),
                rp.getPermission().getCode(),
                rp.getPermission().getResource(),
                rp.getPermission().getAction()
        );
    }
}