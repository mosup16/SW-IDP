package com.iam.identity.Service.Interface;

import com.iam.identity.DTO.AuthenticationDTO.LoginResponse;
import com.iam.identity.DTO.AuthenticationDTO.Logindto;
import com.iam.identity.DTO.AuthenticationDTO.Registerdto;
import org.springframework.stereotype.Service;

@Service
public interface AuthenticationService {
    void register(Registerdto dto);
    boolean login(Logindto request);
}
