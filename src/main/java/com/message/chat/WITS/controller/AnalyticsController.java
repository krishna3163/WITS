package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @GetMapping("/users")
    public ResponseEntity<String> getUserAnalytics() {
        // TODO: Implement user analytics logic
        return ResponseEntity.ok("User analytics.");
    }

    @GetMapping("/messages")
    public ResponseEntity<String> getMessageAnalytics() {
        // TODO: Implement message analytics logic
        return ResponseEntity.ok("Message analytics.");
    }
}
