package com.iam.oauth.Entity;

import com.iam.oauth.Enum.Status;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "client_application", schema = "oauth")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientApplication {
    @Id
    @Column(name = "id")
    private String clientId;

    private String name;
    private String description;

    @Column(name = "client_secret_hash")
    private String clientSecretHash;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "secret_rotated_at")
    private OffsetDateTime secretRotatedAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @OneToMany(mappedBy = "clientApplication", cascade = CascadeType.ALL)
    private List<RedirectUri> redirectUris;

    @OneToMany(mappedBy = "clientApplication", cascade = CascadeType.ALL)
    private List<AuthorizationCode> authorizationCodes;

    @OneToMany(mappedBy = "clientApplication", cascade = CascadeType.ALL)
    private List<AccessToken> accessTokens;

    @PrePersist
    public void prePersist() {
        this.createdAt = OffsetDateTime.now();
    }
}