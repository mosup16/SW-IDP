package com.iam.identity.Service.Interface;

import com.iam.identity.DTO.AuthenticationDTO.LoginSuccessResponse;
import com.iam.identity.DTO.AuthenticationDTO.Logindto;
import com.iam.identity.DTO.AuthenticationDTO.Registerdto;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface AuthenticationService {
    void register(Registerdto dto);
    LoginSuccessResponse login(Logindto request, String userAgent, String ipAddress);
    boolean existsById(UUID id);
}
