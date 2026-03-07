package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Profile;
import com.message.chat.WITS.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Profile> getProfile(@PathVariable UUID userId) {
        Optional<Profile> profileOptional = profileService.getProfile(userId);
        return profileOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
