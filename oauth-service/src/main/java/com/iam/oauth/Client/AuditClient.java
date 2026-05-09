package com.iam.oauth.Client;

import com.iam.oauth.Config.InternalAuthConfig;
import com.iam.oauth.DTO.Audit.AuditEventDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "audit-client-oauth",
             url = "${admin-service.url:http://localhost:8082}",
             configuration = InternalAuthConfig.class)
public interface AuditClient {
    @PostMapping("/internal/audit-events")
    void ingest(@RequestBody AuditEventDto event);
}
