package com.message.chat.WITS.service;

import com.message.chat.WITS.model.UserDevice;
import com.message.chat.WITS.repository.UserDeviceRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserDeviceService {

    private final UserDeviceRepository userDeviceRepository;

    public UserDeviceService(UserDeviceRepository userDeviceRepository) {
        this.userDeviceRepository = userDeviceRepository;
    }

    public Optional<UserDevice> getUserDevice(UUID id) {
        return userDeviceRepository.findById(id);
    }

    public UserDevice updateUserDevice(UserDevice userDevice) {
        return userDeviceRepository.save(userDevice);
    }
}
