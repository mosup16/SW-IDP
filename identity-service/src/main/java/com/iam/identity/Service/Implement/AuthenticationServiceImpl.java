package com.iam.identity.Service.Implement;


import com.iam.identity.DTO.AuthenticationDTO.LoginResponse;
import com.iam.identity.DTO.AuthenticationDTO.Logindto;
import com.iam.identity.DTO.AuthenticationDTO.Registerdto;
import com.iam.identity.Entity.Identity;
import com.iam.identity.Enum.Status;
import com.iam.identity.Repository.AuthenticationRepository.IdentityRepository;
import com.iam.identity.Service.Interface.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final IdentityRepository identityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void register(Registerdto dto) {
        if (identityRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("This Email Is Found !!!! ");
        }

        Identity identity = Identity.builder()
                .email(dto.email())
                .passwordHash(passwordEncoder.encode(dto.password()))
                .displayName(dto.displayName())
                .status(Status.DISABLED)
                .registeredAt(OffsetDateTime.now())
                .build();


        identityRepository.save(identity);
    }


    public boolean login(Logindto request) {

        Identity user = identityRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return true;
    }
}