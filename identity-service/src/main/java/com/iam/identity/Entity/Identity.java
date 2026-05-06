package com.iam.identity.Entity;

import com.iam.identity.Enum.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "identity", schema = "identity")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Identity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "registered_at")
    private OffsetDateTime registeredAt;

    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;

    @Column(name = "disabled_at")
    private OffsetDateTime disabledAt;

    @OneToMany(mappedBy = "identity", cascade = CascadeType.ALL)
    private List<Session> sessions;

    @OneToMany(mappedBy = "identity", cascade = CascadeType.ALL)
    private List<IdentityRole> identityRoles;

}