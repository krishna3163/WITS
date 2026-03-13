package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.ChatGroup;
import com.message.chat.WITS.model.Server;
import com.message.chat.WITS.model.Channel;
import com.message.chat.WITS.model.ChannelType;
import com.message.chat.WITS.service.ChatGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final ChatGroupService chatGroupService;

    public GroupController(ChatGroupService chatGroupService) {
        this.chatGroupService = chatGroupService;
    }

    @PostMapping("/create")
    public ResponseEntity<ChatGroup> createGroup(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String creatorId,
            @RequestParam ChatGroup.GroupVisibility visibility,
            @RequestParam(defaultValue = "false") boolean requiresApproval) {
        return ResponseEntity.ok(chatGroupService.createGroup(name, description, creatorId, visibility, requiresApproval));
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<ChatGroup> joinGroup(
            @PathVariable String groupId,
            @RequestParam String userId) {
        return ResponseEntity.ok(chatGroupService.joinGroup(groupId, userId));
    }

    @PostMapping("/{groupId}/approve")
    public ResponseEntity<ChatGroup> approveJoinRequest(
            @PathVariable String groupId,
            @RequestParam String approverId,
            @RequestParam String targetUserId) {
        return ResponseEntity.ok(chatGroupService.approveJoinRequest(groupId, approverId, targetUserId));
    }

    @PostMapping("/servers/create")
    public ResponseEntity<Server> createServer(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String ownerId) {
        return ResponseEntity.ok(chatGroupService.createServer(name, description, ownerId));
    }

    @PostMapping("/servers/{serverId}/channels")
    public ResponseEntity<Channel> createChannel(
            @PathVariable String serverId,
            @RequestParam String name,
            @RequestParam ChannelType type,
            @RequestParam String category) {
        return ResponseEntity.ok(chatGroupService.createChannel(serverId, name, type, category));
    }

    @PostMapping("/channels/broadcast")
    public ResponseEntity<Channel> createBroadcastChannel(
            @RequestParam String name,
            @RequestParam String ownerId) {
        return ResponseEntity.ok(chatGroupService.createBroadcastChannel(name, ownerId));
    }
}
