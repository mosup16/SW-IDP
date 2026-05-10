package com.iam.identity.Service.Implement;


import com.iam.identity.Audit.Audited;
import com.iam.identity.DTO.AuthenticationDTO.LoginSuccessResponse;
import com.iam.identity.DTO.AuthenticationDTO.Logindto;
import com.iam.identity.DTO.AuthenticationDTO.Registerdto;
import com.iam.identity.Entity.Identity;
import com.iam.identity.Enum.Status;
import com.iam.identity.Repository.AuthenticationRepository.AuthRepository;
import com.iam.identity.Service.Interface.AuthenticationService;
import com.iam.identity.Service.Interface.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionService sessionService;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    @Audited(action = "IDENTITY_REGISTERED", targetType = "IDENTITY")
    public void register(Registerdto dto) {
        if (authRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("This Email Is Found !!!! ");
        }

        Identity identity = Identity.builder()
                .email(dto.email())
                .passwordHash(passwordEncoder.encode(dto.password()))
                .displayName(dto.displayName())
                .status(Status.ENABLED)
                .registeredAt(OffsetDateTime.now())
                .build();

        authRepository.save(identity);
    }

    @Override
    @Transactional
    @Audited(action = "AUTH_LOGIN", targetType = "IDENTITY", targetIdExpr = "#result.identityId")
    public LoginSuccessResponse login(Logindto request, String userAgent, String ipAddress) {
        Identity user = authRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (user.getStatus() == Status.DISABLED) {
            throw new DisabledException("Account is disabled");
        }

        user.setLastLoginAt(OffsetDateTime.now());
        authRepository.save(user);

        byte[] tokenBytes = new byte[32];
        RANDOM.nextBytes(tokenBytes);
        String plainToken = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);

        sessionService.createSession(user.getId(), plainToken, userAgent, ipAddress);

        return new LoginSuccessResponse(user.getId(), user.getEmail(), plainToken);
    }

    @Override
    public boolean existsById(UUID id) {
        return authRepository.existsById(id);
    }
}