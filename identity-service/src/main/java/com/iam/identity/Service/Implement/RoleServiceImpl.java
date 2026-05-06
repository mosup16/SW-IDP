package com.iam.identity.Service.Implement;

import com.iam.identity.DTO.RoleDto.AddRoledto;
import com.iam.identity.DTO.RoleDto.RoleResponse;
import com.iam.identity.Entity.Role;

import com.iam.identity.Repository.RoleRepository.RoleRepository;
import com.iam.identity.Service.Interface.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public void AddRole(AddRoledto request) {
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

        roleRepository.save(role);
    }

    @Override
    public List<RoleResponse> GetAll() {
        return roleRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public RoleResponse GetById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return toResponse(role);
    }

    @Override
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

        roleRepository.save(role);

        return "Role updated successfully";
    }

    @Override
    public String Delete(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        roleRepository.delete(role);
        return "Role deleted successfully";
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