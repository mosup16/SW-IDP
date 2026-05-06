package com.iam.identity.Controller;


import com.iam.identity.DTO.AuthenticationDTO.Logindto;
import com.iam.identity.DTO.AuthenticationDTO.Registerdto;
import com.iam.identity.Service.Interface.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class IdentityController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Registerdto dto) {
        authenticationService.register(dto);
        return ResponseEntity.ok("Registration was successful !!!!");
    }

    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@RequestBody @Valid Logindto request) {
        boolean result = authenticationService.login(request);
        return ResponseEntity.ok(result);
    }
}