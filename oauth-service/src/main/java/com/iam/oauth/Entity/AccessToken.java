package com.iam.oauth.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "access_token", schema = "oauth")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessToken {
    @Id
    private String jti;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private ClientApplication clientApplication;

    @Column(name = "identity_id", nullable = false)
    private UUID identityId;

    @Column(name = "issued_at")
    private OffsetDateTime issuedAt;

    @Column(name = "expires_at")
    private OffsetDateTime expiresAt;

    @Column(name = "revoked_at")
    private OffsetDateTime revokedAt;
}