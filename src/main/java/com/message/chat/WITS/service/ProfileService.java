package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Profile;
import com.message.chat.WITS.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Optional<Profile> getProfile(UUID id) {
        return profileRepository.findById(id);
    }

    public Profile updateProfile(Profile profile) {
        return profileRepository.save(profile);
    }
}
