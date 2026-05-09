package com.iam.oauth.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "refresh_token", schema = "oauth")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "jti")
    private String jti;

    @Column(name = "client_id", nullable = false)
    private String clientId;

    @Column(name = "identity_id", nullable = false)
    private UUID identityId;

    @Column(name = "token_hash")
    private String tokenHash;

    @Column(name = "issued_at")
    private OffsetDateTime issuedAt;

    @Column(name = "expires_at")
    private OffsetDateTime expiresAt;

    @Column(name = "revoked_at")
    private OffsetDateTime revokedAt;

    @Column(name = "used_at")
    private OffsetDateTime usedAt;
}