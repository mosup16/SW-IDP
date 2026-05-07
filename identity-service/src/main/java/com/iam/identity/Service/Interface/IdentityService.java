package com.iam.identity.Service.Interface;

import com.iam.identity.DTO.IdentityDto.CreateIdentityRequest;
import com.iam.identity.DTO.IdentityDto.UpdateIdentityRequest;
import com.iam.identity.DTO.IdentityDto.IdentityResponse;
import com.iam.identity.DTO.IdentityDto.IdentityListResponse;

import java.util.UUID;

public interface IdentityService {

    IdentityListResponse getAllIdentities();

    IdentityResponse createIdentity(CreateIdentityRequest request);

    IdentityResponse getIdentityById(UUID id);

    IdentityResponse updateIdentity(UUID id, UpdateIdentityRequest request);

    void deleteIdentity(UUID id);
}