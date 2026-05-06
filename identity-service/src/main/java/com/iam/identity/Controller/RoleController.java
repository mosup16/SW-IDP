package com.iam.identity.Controller;

import com.iam.identity.DTO.RoleDto.AddRoledto;
import com.iam.identity.DTO.RoleDto.RoleResponse;
import com.iam.identity.Service.Interface.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<Void> addRole(@Valid @RequestBody AddRoledto request) {
        roleService.AddRole(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAll() {
        return ResponseEntity.ok(roleService.GetAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(roleService.GetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable UUID id, @Valid @RequestBody AddRoledto request) {
        return ResponseEntity.ok(roleService.Update(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(roleService.Delete(id));
    }
}