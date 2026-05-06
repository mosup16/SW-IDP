package com.iam.admin.Entity;

import com.iam.admin.Enum.Type;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "system_setting", schema = "admin")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemSetting {
    @Id
    private String key;

    private String value;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "updated_by")
    private UUID updatedBy;


}