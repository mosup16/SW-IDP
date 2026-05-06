package com.iam.identity.Service.Interface;

import com.iam.identity.DTO.RolePermissionDto.AddRolePermissiondto;
import com.iam.identity.DTO.RolePermissionDto.AllRolePermission;

import java.util.List;
import java.util.UUID;

public interface RolePermissionService {

    String AssignPermissionToRole(AddRolePermissiondto dto);

    String RemovePermissionFromRole(UUID roleId, UUID permissionId);

    List<AllRolePermission> GetPermissionsByRole(UUID roleId);
}
