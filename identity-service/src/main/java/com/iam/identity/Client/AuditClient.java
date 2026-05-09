package com.iam.identity.Client;

import com.iam.identity.Config.InternalAuthFeignConfig;
import com.iam.identity.DTO.Audit.AuditEventDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "audit-client-identity",
             url = "${admin-service.url:http://localhost:8082}",
             configuration = InternalAuthFeignConfig.class)
public interface AuditClient {
    @PostMapping("/internal/audit-events")
    void ingest(@RequestBody AuditEventDto event);
}
