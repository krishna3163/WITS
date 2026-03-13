package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(
            @RequestParam UUID conversationId,
            @RequestParam UUID senderId,
            @RequestBody String content,
            @RequestParam(required = false) Message.MessageType type,
            @RequestParam(required = false, defaultValue = "false") boolean isSnap,
            @RequestParam(required = false) Integer expirySeconds) {

        Message message = messageService.sendMessage(conversationId, senderId, content, type, isSnap, expirySeconds);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/schedule")
    public ResponseEntity<Message> scheduleMessage(
            @RequestParam UUID conversationId,
            @RequestParam UUID senderId,
            @RequestBody String content,
            @RequestParam java.time.LocalDateTime scheduledAt) {

        Message message = messageService.sendScheduledMessage(conversationId, senderId, content, scheduledAt);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable UUID messageId,
            @RequestParam String readerId) {

        messageService.markMessageAsRead(messageId, readerId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{messageId}/screenshot")
    public ResponseEntity<Void> reportScreenshot(
            @PathVariable UUID messageId,
            @RequestParam String reporterId) {

        messageService.reportScreenshot(messageId, reporterId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable UUID conversationId) {
        return ResponseEntity.ok(messageService.getConversationMessages(conversationId));
    }
}
