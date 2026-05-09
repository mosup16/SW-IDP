package com.iam.identity.Controller;

import com.iam.identity.DTO.AuthenticationDTO.LoginSuccessResponse;
import com.iam.identity.DTO.AuthenticationDTO.Logindto;
import com.iam.identity.DTO.AuthenticationDTO.Registerdto;
import com.iam.identity.Service.Interface.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Registerdto dto) {
        authenticationService.register(dto);
        return ResponseEntity.status(201).body("Registration was successful !!!!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid Logindto request,
                                   HttpServletRequest httpRequest,
                                   HttpServletResponse httpResponse) {
        try {
            LoginSuccessResponse result = authenticationService.login(
                    request,
                    httpRequest.getHeader("User-Agent"),
                    httpRequest.getRemoteAddr());

            Cookie cookie = new Cookie("SESSION", result.sessionToken());
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(30 * 24 * 60 * 60);
            httpResponse.addCookie(cookie);

            return ResponseEntity.ok(result);
        } catch (UsernameNotFoundException | BadCredentialsException e) {
            return ResponseEntity.status(401).body("{\"error\":\"invalid_credentials\"}");
        } catch (DisabledException e) {
            return ResponseEntity.status(403).body("{\"error\":\"account_disabled\"}");
        }
    }

    @GetMapping("/internal/identities/{id}/exists")
    public ResponseEntity<Boolean> existsById(@PathVariable UUID id) {
        return ResponseEntity.ok(authenticationService.existsById(id));
    }
}