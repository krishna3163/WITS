package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messaging")
public class MessagingController {

    @PostMapping("/chat")
    public ResponseEntity<String> sendMessage(@RequestBody String message) {
        // TODO: Implement send message logic for 1-to-1, group, channel, etc.
        return ResponseEntity.ok("Message sent.");
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<String> getMessages(@PathVariable String chatId) {
        // TODO: Implement get messages logic
        return ResponseEntity.ok("Messages for chat " + chatId);
    }
}
