package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.UserDevice;
import com.message.chat.WITS.service.UserDeviceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users/devices")
public class UserDeviceController {

    private final UserDeviceService userDeviceService;

    public UserDeviceController(UserDeviceService userDeviceService) {
        this.userDeviceService = userDeviceService;
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<UserDevice> getUserDevice(@PathVariable UUID deviceId) {
        Optional<UserDevice> userDeviceOptional = userDeviceService.getUserDevice(deviceId);
        return userDeviceOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{deviceId}")
    public ResponseEntity<UserDevice> updateUserDevice(@PathVariable UUID deviceId, @RequestBody UserDevice userDevice) {
        userDevice.setDevice_id(deviceId);
        UserDevice updatedUserDevice = userDeviceService.updateUserDevice(userDevice);
        return ResponseEntity.ok(updatedUserDevice);
    }
}
