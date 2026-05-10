package com.iam.identity.Service.Implement;

import com.iam.identity.DTO.PermissionDto.AddPermissiondto;
import com.iam.identity.DTO.PermissionDto.AllPermissiondto;
import com.iam.identity.Entity.Permission;
import com.iam.identity.Repository.PermissionRepository.PermissionRepository;
import com.iam.identity.Service.Interface.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    @Transactional
    public String AddPermission(AddPermissiondto dto) {
        if (permissionRepository.existsByCode(dto.code())) {
            throw new RuntimeException("Permission already exists");
        }

        Permission permission = Permission.builder()
                .code(dto.code())
                .resource(dto.resource())
                .action(dto.action())
                .description(dto.description())
                .build();

        permissionRepository.save(permission);
        return "Permission added successfully";
    }

    @Override
    @Transactional(readOnly = true)
    public List<AllPermissiondto> GetAll() {
        return permissionRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AllPermissiondto GetById(UUID id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
        return toDto(permission);
    }

    @Override
    @Transactional
    public String Update(UUID id, AddPermissiondto dto) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        if (!permission.getCode().equals(dto.code()) && permissionRepository.existsByCode(dto.code())) {
            throw new RuntimeException("Permission code already exists");
        }

        permission.setCode(dto.code());
        permission.setResource(dto.resource());
        permission.setAction(dto.action());
        permission.setDescription(dto.description());

        permissionRepository.save(permission);
        return "Permission updated successfully";
    }

    @Override
    @Transactional
    public String Delete(UUID id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
        permissionRepository.delete(permission);
        return "Permission deleted successfully";
    }

    private AllPermissiondto toDto(Permission permission) {
        return new AllPermissiondto(
                permission.getId(),
                permission.getCode(),
                permission.getResource(),
                permission.getAction(),
                permission.getDescription()
        );
    }
}
