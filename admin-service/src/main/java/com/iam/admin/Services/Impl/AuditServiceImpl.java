package com.iam.admin.Services.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iam.admin.DTOs.AuditEventDto;
import com.iam.admin.DTOs.AuditLogResponse;
import com.iam.admin.Entity.AuditLog;
import com.iam.admin.Enum.Status;
import com.iam.admin.Repository.AuditLogRepository;
import com.iam.admin.Services.Interface.AuditService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void ingest(AuditEventDto event) {
        String metaJson = null;
        if (event.metadata() != null) {
            try {
                metaJson = objectMapper.writeValueAsString(event.metadata());
            } catch (Exception e) {
                log.warn("Failed to serialize audit metadata", e);
            }
        }

        Status status;
        try {
            status = Status.valueOf(event.status().toUpperCase());
        } catch (Exception e) {
            status = Status.SUCCESS;
        }

        AuditLog entry = AuditLog.builder()
                .timestampUtc(event.timestampUtc() != null
                        ? OffsetDateTime.ofInstant(event.timestampUtc(), ZoneOffset.UTC)
                        : OffsetDateTime.now(ZoneOffset.UTC))
                .actorId(event.actorId())
                .action(event.action())
                .targetType(event.targetType())
                .targetId(event.targetId())
                .status(status)
                .ipAddress(event.ipAddress())
                .metadata(metaJson)
                .build();

        auditLogRepository.save(entry);
    }

    @Override
    public Page<AuditLogResponse> query(Instant from, Instant to, String action, String status,
                                         UUID actorId, Pageable pageable) {
        Specification<AuditLog> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("timestampUtc"),
                        OffsetDateTime.ofInstant(from, ZoneOffset.UTC)));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("timestampUtc"),
                        OffsetDateTime.ofInstant(to, ZoneOffset.UTC)));
            }
            if (action != null) {
                predicates.add(cb.equal(root.get("action"), action));
            }
            if (status != null) {
                try {
                    predicates.add(cb.equal(root.get("status"), Status.valueOf(status.toUpperCase())));
                } catch (Exception ignored) {}
            }
            if (actorId != null) {
                predicates.add(cb.equal(root.get("actorId"), actorId));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return auditLogRepository.findAll(spec, pageable).map(this::toResponse);
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return new AuditLogResponse(
                log.getId(), log.getTimestampUtc(), log.getActorId(),
                log.getAction(), log.getTargetType(), log.getTargetId(),
                log.getStatus() != null ? log.getStatus().name() : null,
                log.getIpAddress(), log.getMetadata()
        );
    }
}
