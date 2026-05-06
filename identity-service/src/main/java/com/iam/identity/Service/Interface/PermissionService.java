package com.iam.identity.Service.Interface;

import com.iam.identity.DTO.PermissionDto.AddPermissiondto;
import com.iam.identity.DTO.PermissionDto.AllPermissiondto;

import java.util.List;
import java.util.UUID;

public interface PermissionService {
    String AddPermission(AddPermissiondto dto);
    List<AllPermissiondto> GetAll();
    AllPermissiondto GetById(UUID Id);
    String Update(UUID Id  , AddPermissiondto dto);
    String Delete(UUID id);
}
