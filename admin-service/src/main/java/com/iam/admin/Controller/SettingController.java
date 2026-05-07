package com.iam.admin.Controller;

import com.iam.admin.DTOs.GetsettingsDto;
import com.iam.admin.DTOs.UpdateSettingDto;
import com.iam.admin.Services.Interface.SettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
public class SettingController {

    private final SettingService settingService;

    @GetMapping
    public ResponseEntity<List<GetsettingsDto>> getAll() {
        return ResponseEntity.ok(settingService.GetAll());
    }

    @GetMapping("/{key}")
    public ResponseEntity<GetsettingsDto> getByKey(@PathVariable String key) {
        return ResponseEntity.ok(settingService.GetByKey(key));
    }

    @PutMapping("/{key}")
    public ResponseEntity<String> update(@PathVariable String key, @Valid @RequestBody UpdateSettingDto dto) {
        return ResponseEntity.ok(settingService.Update(key, dto));
    }
}