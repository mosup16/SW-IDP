package com.iam.identity.Controller;

import com.iam.identity.DTO.PermissionDto.AddPermissiondto;
import com.iam.identity.DTO.PermissionDto.AllPermissiondto;
import com.iam.identity.Service.Interface.PermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping
    public ResponseEntity<String> addPermission(@Valid @RequestBody AddPermissiondto request) {
        return ResponseEntity.ok(permissionService.AddPermission(request));
    }

    @GetMapping
    public ResponseEntity<List<AllPermissiondto>> getAll() {
        return ResponseEntity.ok(permissionService.GetAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AllPermissiondto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(permissionService.GetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable UUID id, @Valid @RequestBody AddPermissiondto request) {
        return ResponseEntity.ok(permissionService.Update(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(permissionService.Delete(id));
    }
}