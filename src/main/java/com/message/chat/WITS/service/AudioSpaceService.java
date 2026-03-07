package com.message.chat.WITS.service;

import com.message.chat.WITS.model.AudioSpace;
import com.message.chat.WITS.repository.AudioSpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AudioSpaceService {

    private final AudioSpaceRepository audioSpaceRepository;

    public AudioSpace createAudioSpace(UUID hostId, String title) {
        AudioSpace space = AudioSpace.builder()
                .id(UUID.randomUUID())
                .hostId(hostId)
                .title(title)
                .isLive(true)
                .startedAt(Instant.now())
                .build();
        space.getSpeakerIds().add(hostId);
        return audioSpaceRepository.save(space);
    }

    public void endAudioSpace(UUID spaceId) {
        audioSpaceRepository.findById(spaceId).ifPresent(space -> {
            space.setLive(false);
            space.setEndedAt(Instant.now());
            audioSpaceRepository.save(space);
        });
    }

    public void joinAsListener(UUID spaceId, UUID userId) {
        audioSpaceRepository.findById(spaceId).ifPresent(space -> {
            space.getListenerIds().add(userId);
            audioSpaceRepository.save(space);
        });
    }

    public void promoteToSpeaker(UUID spaceId, UUID userId) {
        audioSpaceRepository.findById(spaceId).ifPresent(space -> {
            space.getSpeakerIds().add(userId);
            space.getListenerIds().remove(userId);
            audioSpaceRepository.save(space);
        });
    }
}
