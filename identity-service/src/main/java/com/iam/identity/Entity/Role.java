package com.iam.identity.Entity;

import com.iam.identity.Enum.Type;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "role", schema = "identity")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "last_modified_at")
    private OffsetDateTime lastModifiedAt;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
    private List<IdentityRole> identityRoles;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
    private List<RolePermission> rolePermissions;
}

