package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.UserSettings;
import com.message.chat.WITS.service.UserSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users/settings")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    public UserSettingsController(UserSettingsService userSettingsService) {
        this.userSettingsService = userSettingsService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserSettings> getUserSettings(@PathVariable UUID userId) {
        Optional<UserSettings> userSettingsOptional = userSettingsService.getUserSettings(userId);
        return userSettingsOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserSettings> updateUserSettings(@PathVariable UUID userId, @RequestBody UserSettings userSettings) {
        userSettings.setUser_id(userId);
        UserSettings updatedUserSettings = userSettingsService.updateUserSettings(userSettings);
        return ResponseEntity.ok(updatedUserSettings);
    }
}
