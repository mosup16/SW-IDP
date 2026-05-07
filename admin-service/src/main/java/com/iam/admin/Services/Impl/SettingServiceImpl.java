package com.iam.admin.Services.Impl;

import com.iam.admin.DTOs.GetsettingsDto;
import com.iam.admin.DTOs.UpdateSettingDto;
import com.iam.admin.Entity.SystemSetting;

import com.iam.admin.Repository.SystemSettingRepository;
import com.iam.admin.Services.Interface.IdentityClient;
import com.iam.admin.Services.Interface.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SettingServiceImpl implements SettingService {

    private final SystemSettingRepository systemSettingRepository;
    private final IdentityClient identityClient;

    @Override
    public List<GetsettingsDto> GetAll() {
        return systemSettingRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public GetsettingsDto GetByKey(String key) {
        SystemSetting setting = systemSettingRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("Setting not found"));
        return toDto(setting);
    }

    @Override
    public String Update(String key, UpdateSettingDto dto) {
        SystemSetting setting = systemSettingRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("Setting not found"));



        // Check If User Is Found
        // Verify updatedBy user exists via Identity Service
        if (!identityClient.existsById(dto.UpdatedBy())) {
            throw new RuntimeException("User not found");
        }
        // Check If User Is Admin // We Will Get UpdatedBy By UserId in JWT




        setting.setValue(dto.value());
        setting.setType(dto.type());
        setting.setUpdatedBy(dto.UpdatedBy()); // We Will Get UpdatedBy By UserId in JWT
        setting.setUpdatedAt(OffsetDateTime.now());

        systemSettingRepository.save(setting);
        return "Setting updated successfully";
    }

    private GetsettingsDto toDto(SystemSetting setting) {
        return new GetsettingsDto(
                setting.getKey(),
                setting.getValue(),
                setting.getType(),
                setting.getUpdatedAt(),
                setting.getUpdatedBy()
        );
    }
}