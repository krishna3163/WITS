package com.message.chat.WITS.service;

import com.message.chat.WITS.model.BroadcastChannel;
import com.message.chat.WITS.repository.BroadcastChannelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChannelFeatureService {

    private final BroadcastChannelRepository channelRepository;

    public BroadcastChannel createChannel(String name, String description, String ownerId, boolean isPublic) {
        BroadcastChannel channel = BroadcastChannel.builder()
                .name(name)
                .description(description)
                .ownerId(ownerId)
                .isPublic(isPublic)
                .createdAt(LocalDateTime.now())
                .inviteLink(isPublic ? "wits.app/c/" + name.replaceAll("\\s", "").toLowerCase()
                        : UUID.randomUUID().toString())
                .build();

        // Owner automatically counts as admin
        channel.getAdminIds().add(ownerId);
        channel.getSubscriberIds().add(ownerId);

        return channelRepository.save(channel);
    }

    public void addAdmin(String channelId, String ownerId, String newAdminId) {
        channelRepository.findById(channelId).ifPresent(c -> {
            if (c.getOwnerId().equals(ownerId)) {
                c.getAdminIds().add(newAdminId);
                channelRepository.save(c);
            }
        });
    }

    public void subscribe(String channelId, String userId) {
        channelRepository.findById(channelId).ifPresent(c -> {
            c.getSubscriberIds().add(userId);
            channelRepository.save(c);
        });
    }

    public void unsubscribe(String channelId, String userId) {
        channelRepository.findById(channelId).ifPresent(c -> {
            c.getSubscriberIds().remove(userId);
            channelRepository.save(c);
        });
    }

    public Optional<BroadcastChannel> findByInviteLink(String link) {
        return channelRepository.findByInviteLink(link);
    }
}
