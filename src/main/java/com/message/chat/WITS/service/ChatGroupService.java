package com.message.chat.WITS.service;

import com.message.chat.WITS.model.ChatGroup;
import com.message.chat.WITS.model.GroupRole;
import com.message.chat.WITS.model.Server;
import com.message.chat.WITS.model.Channel;
import com.message.chat.WITS.model.ChannelType;
import com.message.chat.WITS.repository.ChatGroupRepository;
import com.message.chat.WITS.repository.ServerRepository;
import com.message.chat.WITS.repository.ChannelRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatGroupService {

    private final ChatGroupRepository chatGroupRepository;
    private final ServerRepository serverRepository;
    private final ChannelRepository channelRepository;

    public ChatGroupService(ChatGroupRepository chatGroupRepository, ServerRepository serverRepository, ChannelRepository channelRepository) {
        this.chatGroupRepository = chatGroupRepository;
        this.serverRepository = serverRepository;
        this.channelRepository = channelRepository;
    }

    // --- Discord/Telegram Style Groups ---

    public ChatGroup createGroup(String name, String description, String creatorId, ChatGroup.GroupVisibility visibility, boolean requiresApproval) {
        ChatGroup group = ChatGroup.builder()
                .name(name)
                .description(description)
                .visibility(visibility)
                .requiresApproval(requiresApproval)
                .build();

        // Add creator as OWNER
        group.getMembers().put(creatorId, GroupRole.OWNER);

        if (visibility == ChatGroup.GroupVisibility.PUBLIC) {
            group.setInviteLink("https://wits.app/g/" + UUID.randomUUID().toString().substring(0, 8));
        }

        return chatGroupRepository.save(group);
    }

    public ChatGroup joinGroup(String groupId, String userId) {
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (group.getMembers().containsKey(userId)) {
            return group; // Already member
        }

        if (group.isRequiresApproval()) {
            group.getPendingApprovalUserIds().add(userId);
        } else {
            group.getMembers().put(userId, GroupRole.MEMBER);
        }

        return chatGroupRepository.save(group);
    }

    public ChatGroup approveJoinRequest(String groupId, String approverId, String targetUserId) {
        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        GroupRole role = group.getMembers().get(approverId);
        if (role != GroupRole.OWNER && role != GroupRole.ADMIN) {
            throw new RuntimeException("Not authorized");
        }

        if (group.getPendingApprovalUserIds().remove(targetUserId)) {
            group.getMembers().put(targetUserId, GroupRole.MEMBER);
        }

        return chatGroupRepository.save(group);
    }

    // --- Discord Style Servers/Communities ---

    public Server createServer(String name, String description, String ownerId) {
        Server server = Server.builder()
                .name(name)
                .description(description)
                .ownerId(ownerId)
                .build();

        server.getMemberIds().add(ownerId);

        // Setup initial default roles (simplified)
        server.getUserRoles().put(ownerId, List.of("OWNER_ROLE"));

        Server savedServer = serverRepository.save(server);

        // Create default channels
        createChannel(savedServer.getId(), "general", ChannelType.TEXT, "Text Channels");
        createChannel(savedServer.getId(), "General Voice", ChannelType.VOICE, "Voice Channels");

        return savedServer;
    }

    public Channel createChannel(String serverId, String name, ChannelType type, String category) {
        Channel channel = Channel.builder()
                .serverId(serverId)
                .name(name)
                .type(type)
                .category(category)
                .build();
        return channelRepository.save(channel);
    }

    // --- Telegram Style Broadcast Channels ---

    public Channel createBroadcastChannel(String name, String ownerId) {
        Channel channel = Channel.builder()
                .name(name)
                // Using TEXT type for Broadcast channels and marking it as private broadcast style
                .type(ChannelType.TEXT)
                .isPrivate(false)
                .subscribersCount(1) // Owner
                .build();
        return channelRepository.save(channel);
    }
}
