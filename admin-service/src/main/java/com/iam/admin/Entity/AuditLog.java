package com.iam.admin.Entity;

import com.iam.admin.Enum.Status;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_log", schema = "admin")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "timestamp_utc")
    private OffsetDateTime timestampUtc;

    @Column(name = "actor_id")
    private UUID actorId;

    private String action;

    @Column(name = "target_type")
    private String targetType;

    @Column(name = "target_id")
    private String targetId;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(columnDefinition = "jsonb")
    private String metadata;


}