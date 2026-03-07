package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Conversation;
import com.message.chat.WITS.service.ConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping("/create")
    public ResponseEntity<Conversation> createConversation(@RequestBody List<UUID> userIds) {
        return ResponseEntity.ok(conversationService.createConversation(userIds));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Conversation>> getConversations(@PathVariable UUID userId) {
        return ResponseEntity.ok(conversationService.getUserConversations(userId));
    }
}
