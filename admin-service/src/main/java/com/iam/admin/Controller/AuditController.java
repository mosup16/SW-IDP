package com.iam.admin.Controller;

import com.iam.admin.DTOs.AuditEventDto;
import com.iam.admin.DTOs.AuditLogResponse;
import com.iam.admin.Services.Interface.AuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @PostMapping("/internal/audit-events")
    public ResponseEntity<Void> ingest(@RequestBody AuditEventDto event) {
        auditService.ingest(event);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<Page<AuditLogResponse>> query(
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID actorId,
            @PageableDefault(size = 25, sort = "timestampUtc", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditService.query(from, to, action, status, actorId, pageable));
    }
}
