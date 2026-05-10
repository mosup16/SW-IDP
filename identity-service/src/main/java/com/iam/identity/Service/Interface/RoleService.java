package com.iam.identity.Service.Interface;

import com.iam.identity.DTO.RoleDto.AddRoledto;
import com.iam.identity.DTO.RoleDto.RoleResponse;

import java.util.List;
import java.util.UUID;

public interface RoleService {
    RoleResponse AddRole(AddRoledto addRoledto);
    List<RoleResponse> GetAll();
    RoleResponse GetById(UUID Id);
    String Update(UUID Id ,AddRoledto addRoledto );
    String Delete(UUID Id);
}
