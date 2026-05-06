package com.iam.oauth.Service.Interface;

import com.iam.oauth.DTO.ClientAppdto.AddClientAppDto;
import com.iam.oauth.DTO.ClientAppdto.ClientResponsedto;
import com.iam.oauth.DTO.ClientAppdto.RotateSecretdto;

import java.util.List;

public interface ClientApplicationService {
    String AddClient(AddClientAppDto dto);
    List<ClientResponsedto> GetAll();
    ClientResponsedto GetById(String clientId);
    String Update(String clientId, AddClientAppDto dto);
    String Delete(String clientId);
    String RotateSecret(String clientId, RotateSecretdto dto);
}
