package com.iam.identity.Service.Implement;

import com.iam.identity.Audit.Audited;
import com.iam.identity.DTO.IdentityDto.*;
import com.iam.identity.Entity.Identity;
import com.iam.identity.Enum.Status;
import com.iam.identity.Repository.IdentityRepository.IdentityRepository;
import com.iam.identity.Service.Interface.IdentityService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IdentityServiceImpl implements IdentityService {

    private final IdentityRepository identityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public IdentityListResponse getAllIdentities() {
        List<IdentityResponse> identities = identityRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

        long totalUsers = identityRepository.count();
        long activeNow = identityRepository.countEnabledIdentities();

        return new IdentityListResponse(identities, totalUsers, activeNow);
    }

    @Override
    @Transactional
    @Audited(action = "IDENTITY_CREATED", targetType = "IDENTITY", targetIdExpr = "#result.id")
    public IdentityResponse createIdentity(CreateIdentityRequest request) {
        if (identityRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("Email already exists");
        }

        Identity identity = Identity.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .displayName(request.displayName())
                .status(Status.DISABLED)
                .registeredAt(OffsetDateTime.now())
                .build();

        return toResponse(identityRepository.save(identity));
    }

    @Override
    @Transactional(readOnly = true)
    public IdentityResponse getIdentityById(UUID id) {
        return toResponse(findById(id));
    }

    @Override
    @Transactional
    @Audited(action = "IDENTITY_UPDATED", targetType = "IDENTITY", targetIdExpr = "#args[0]")
    public IdentityResponse updateIdentity(UUID id, UpdateIdentityRequest request) {
        Identity identity = findById(id);

        if (request.displayName() != null) {
            identity.setDisplayName(request.displayName());
        }

        if (request.status() != null) {
            identity.setStatus(request.status());

            if (request.status() == Status.DISABLED) {
                identity.setDisabledAt(OffsetDateTime.now());
            } else {
                identity.setDisabledAt(null);
            }
        }

        return toResponse(identityRepository.save(identity));
    }

    @Override
    @Transactional
    @Audited(action = "IDENTITY_DELETED", targetType = "IDENTITY", targetIdExpr = "#args[0]")
    public void deleteIdentity(UUID id) {
        if (!identityRepository.existsById(id)) {
            throw new EntityNotFoundException("Identity not found");
        }
        identityRepository.deleteById(id);
    }

    private Identity findById(UUID id) {
        return identityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Identity not found"));
    }

    private IdentityResponse toResponse(Identity identity) {
        return new IdentityResponse(
                identity.getId(),
                identity.getEmail(),
                identity.getDisplayName(),
                identity.getStatus(),
                identity.getRegisteredAt(),
                identity.getLastLoginAt()
        );
    }
}
