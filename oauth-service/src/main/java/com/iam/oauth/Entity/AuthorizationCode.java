package com.iam.oauth.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "authorization_code", schema = "oauth")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorizationCode {
    @Id
    private String code;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private ClientApplication clientApplication;

    @Column(name = "identity_id", nullable = false)
    private UUID identityId;

    @Column(name = "redirect_uri")
    private String redirectUri;

    @Column(name = "issued_at")
    private OffsetDateTime issuedAt;

    @Column(name = "expires_at")
    private OffsetDateTime expiresAt;

    @Column(name = "used_at")
    private OffsetDateTime usedAt;
}