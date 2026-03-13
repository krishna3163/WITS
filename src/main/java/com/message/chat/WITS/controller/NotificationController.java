package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping
    public ResponseEntity<String> getNotifications() {
        // TODO: Implement get notifications logic
        return ResponseEntity.ok("List of notifications.");
    }

    @PostMapping("/settings")
    public ResponseEntity<String> updateSettings(@RequestBody String settings) {
        // TODO: Implement update notification settings logic
        return ResponseEntity.ok("Notification settings updated.");
    }
}
