package com.iam.admin.Services.Interface;

import com.iam.admin.DTOs.GetsettingsDto;
import com.iam.admin.DTOs.UpdateSettingDto;

import java.util.List;

public interface SettingService {
    List<GetsettingsDto> GetAll();
    GetsettingsDto GetByKey(String key);
    String Update(String key, UpdateSettingDto dto);
}
