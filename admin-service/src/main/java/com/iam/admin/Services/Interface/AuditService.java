package com.iam.admin.Services.Interface;

import com.iam.admin.DTOs.AuditEventDto;
import com.iam.admin.DTOs.AuditLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.UUID;

public interface AuditService {
    void ingest(AuditEventDto event);
    Page<AuditLogResponse> query(Instant from, Instant to, String action, String status,
                                 UUID actorId, Pageable pageable);
}
