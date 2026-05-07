package com.iam.identity.Service.Interface;

import com.iam.identity.DTO.IdentityRoleDto.AssignRoleToIdentity;
import com.iam.identity.DTO.IdentityRoleDto.IdentityRoleResponse;
import com.iam.identity.DTO.IdentityRoleDto.RemoveRoleFromIdentity;

import java.util.List;
import java.util.UUID;

public interface IdentityRoleService {
    IdentityRoleResponse assignRole(AssignRoleToIdentity dto);
    void removeRole(RemoveRoleFromIdentity dto);
    List<IdentityRoleResponse> getIdentityRoles(UUID identityId);



}
