package com.message.chat.WITS.service;

import com.message.chat.WITS.model.UserSettings;
import com.message.chat.WITS.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;

    public UserSettingsService(UserSettingsRepository userSettingsRepository) {
        this.userSettingsRepository = userSettingsRepository;
    }

    public Optional<UserSettings> getUserSettings(UUID id) {
        return userSettingsRepository.findById(id);
    }

    public UserSettings updateUserSettings(UserSettings userSettings) {
        return userSettingsRepository.save(userSettings);
    }
}
