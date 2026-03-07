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
            @RequestBody String content) {

        Message message = messageService.sendMessage(conversationId, senderId, content);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable UUID conversationId) {
        return ResponseEntity.ok(messageService.getConversationMessages(conversationId));
    }
}
