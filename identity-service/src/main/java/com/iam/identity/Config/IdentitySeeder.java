package com.iam.identity.Config;

import com.iam.identity.Entity.Identity;
import com.iam.identity.Entity.IdentityRole;
import com.iam.identity.Entity.Permission;
import com.iam.identity.Entity.Role;
import com.iam.identity.Entity.RolePermission;
import com.iam.identity.Enum.Status;
import com.iam.identity.Enum.Type;
import com.iam.identity.Repository.AuthenticationRepository.AuthRepository;
import com.iam.identity.Repository.IdentityRoleRepository.IdentityRoleRepository;
import com.iam.identity.Repository.PermissionRepository.PermissionRepository;
import com.iam.identity.Repository.RolePermissionRepository.RolePermissionRepository;
import com.iam.identity.Repository.RoleRepository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class IdentitySeeder implements ApplicationRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final AuthRepository authRepository;
    private final IdentityRoleRepository identityRoleRepository;
    private final PasswordEncoder passwordEncoder;

    private static final List<String> AUTHORITIES = List.of(
            "users.read", "users.write",
            "roles.read", "roles.write",
            "clients.read", "clients.write",
            "logs.view",
            "settings.read", "settings.write"
    );

    private static final Set<String> READ_ONLY_AUTHORITIES = Set.of(
            "users.read", "roles.read", "clients.read", "logs.view", "settings.read"
    );

    private static final String ADMIN_EMAIL = "admin@local";
    private static final String ADMIN_PASSWORD = "Admin12345!";

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedPermissions();
        Role superAdmin = ensureRole("SUPER_ADMIN", "Full administrative access");
        Role readOnly   = ensureRole("READ_ONLY",   "Read-only operator role");
        linkAllPermissions(superAdmin);
        linkPermissions(readOnly, READ_ONLY_AUTHORITIES);
        Identity admin = ensureAdminIdentity();
        ensureIdentityRole(admin, superAdmin);
    }

    private void seedPermissions() {
        for (String code : AUTHORITIES) {
            if (permissionRepository.findByCode(code).isEmpty()) {
                String[] parts = code.split("\\.");
                permissionRepository.save(Permission.builder()
                        .code(code)
                        .resource(parts[0])
                        .action(parts.length > 1 ? parts[1] : null)
                        .description("Permission " + code)
                        .build());
            }
        }
    }

    private Role ensureRole(String name, String description) {
        return roleRepository.findByName(name).orElseGet(() -> roleRepository.save(Role.builder()
                .name(name)
                .description(description)
                .type(Type.BUILT_IN)
                .createdAt(OffsetDateTime.now())
                .lastModifiedAt(OffsetDateTime.now())
                .build()));
    }

    private void linkAllPermissions(Role role) {
        permissionRepository.findAll().forEach(p -> ensureRolePermission(role, p));
    }

    private void linkPermissions(Role role, Set<String> codes) {
        codes.forEach(code -> permissionRepository.findByCode(code)
                .ifPresent(p -> ensureRolePermission(role, p)));
    }

    private void ensureRolePermission(Role role, Permission permission) {
        if (!rolePermissionRepository.existsByRoleIdAndPermissionId(role.getId(), permission.getId())) {
            rolePermissionRepository.save(RolePermission.builder()
                    .role(role)
                    .permission(permission)
                    .build());
        }
    }

    private Identity ensureAdminIdentity() {
        return authRepository.findByEmail(ADMIN_EMAIL).orElseGet(() -> {
            log.info("Seeding default admin identity {}", ADMIN_EMAIL);
            return authRepository.save(Identity.builder()
                    .email(ADMIN_EMAIL)
                    .passwordHash(passwordEncoder.encode(ADMIN_PASSWORD))
                    .displayName("Local Admin")
                    .status(Status.ENABLED)
                    .registeredAt(OffsetDateTime.now())
                    .build());
        });
    }

    private void ensureIdentityRole(Identity identity, Role role) {
        if (!identityRoleRepository.existsByIdentityIdAndRoleId(identity.getId(), role.getId())) {
            identityRoleRepository.save(IdentityRole.builder()
                    .identity(identity)
                    .role(role)
                    .assignedAt(OffsetDateTime.now())
                    .build());
        }
    }
}
