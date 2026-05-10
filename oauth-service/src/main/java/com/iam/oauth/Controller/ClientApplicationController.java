package com.iam.oauth.Controller;

import com.iam.oauth.DTO.ClientAppdto.AddClientAppDto;
import com.iam.oauth.DTO.ClientAppdto.ClientResponsedto;
import com.iam.oauth.DTO.ClientAppdto.RotateSecretdto;
import com.iam.oauth.Service.Interface.ClientApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientApplicationController {

    private final ClientApplicationService clientApplicationService;

    @PostMapping
    public ResponseEntity<String> addClient(@Valid @RequestBody AddClientAppDto request) {
        return ResponseEntity.ok(clientApplicationService.AddClient(request));
    }

    @GetMapping
    public ResponseEntity<List<ClientResponsedto>> getAll() {
        return ResponseEntity.ok(clientApplicationService.GetAll());
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<ClientResponsedto> getById(@PathVariable String clientId) {
        return ResponseEntity.ok(clientApplicationService.GetById(clientId));
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<String> update(@PathVariable String clientId, @Valid @RequestBody AddClientAppDto request) {
        return ResponseEntity.ok(clientApplicationService.Update(clientId, request));
    }

    @DeleteMapping("/{clientId}")
    public ResponseEntity<String> delete(@PathVariable String clientId) {
        return ResponseEntity.ok(clientApplicationService.Delete(clientId));
    }

    @PostMapping("/{clientId}/rotate-secret")
    public ResponseEntity<String> rotateSecret(@PathVariable String clientId, @Valid @RequestBody RotateSecretdto request) {
        return ResponseEntity.ok(clientApplicationService.RotateSecret(clientId, request));
    }
}
