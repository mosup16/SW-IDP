package com.iam.identity.Service.Implement;


import com.iam.identity.DTO.AuthenticationDTO.Logindto;
import com.iam.identity.DTO.AuthenticationDTO.Registerdto;
import com.iam.identity.Entity.Identity;
import com.iam.identity.Enum.Status;
import com.iam.identity.Repository.AuthenticationRepository.AuthRepository;
import com.iam.identity.Service.Interface.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void register(Registerdto dto) {
        if (authRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("This Email Is Found !!!! ");
        }

        Identity identity = Identity.builder()
                .email(dto.email())
                .passwordHash(passwordEncoder.encode(dto.password()))
                .displayName(dto.displayName())
                .status(Status.DISABLED)
                .registeredAt(OffsetDateTime.now())
                .build();


        authRepository.save(identity);
    }


    public boolean login(Logindto request) {

        Identity user = authRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return true;
    }

    @Override
    public boolean existsById(UUID id) {
        return authRepository.existsById(id);
    }
}