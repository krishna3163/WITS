package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Channel;
import com.message.chat.WITS.model.ChannelType;
import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.model.Permission;
import com.message.chat.WITS.repository.ChannelRepository;
import com.message.chat.WITS.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final MessageRepository messageRepository;

    public List<Channel> getChannels(String serverId) {
        return channelRepository.findByServerIdOrderByPositionAsc(serverId);
    }

    public void createDefaultChannels(String serverId) {
        createChannel(serverId, "general", ChannelType.TEXT);
        createChannel(serverId, "voice", ChannelType.VOICE);
    }

    public Channel createChannel(String serverId, String name, ChannelType type) {
        Channel channel = Channel.builder()
                .serverId(serverId)
                .name(name)
                .type(type)
                .build();
        return channelRepository.save(channel);
    }

    public void schedulePost(String channelId, String content, LocalDateTime scheduledTime) {
        Message message = Message.builder()
                .channelId(channelId)
                .content(content)
                .scheduledAt(scheduledTime)
                .timestamp(LocalDateTime.now())
                .build();
        messageRepository.save(message);
    }

    public void incrementViewCount(String channelId, String messageId) {
        channelRepository.findById(channelId).ifPresent(channel -> {
            long currentViews = channel.getPostViews().getOrDefault(messageId, 0L);
            channel.getPostViews().put(messageId, currentViews + 1);
            channelRepository.save(channel);
        });
    }

    public Optional<Channel> getChannelAnalytics(String channelId) {
        return channelRepository.findById(channelId);
    }

    public boolean hasPermission(String channelId, String userId, Permission permission, ServerService serverService) {
        // Implement full permission check later
        return true;
    }
}
