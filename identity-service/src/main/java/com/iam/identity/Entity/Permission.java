package com.iam.identity.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "permission", schema = "identity")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String code;

    private String resource;

    private String action;

    private String description;

    @OneToMany(mappedBy = "permission", cascade = CascadeType.ALL)
    private List<com.iam.identity.Entity.RolePermission> rolePermissions;
}