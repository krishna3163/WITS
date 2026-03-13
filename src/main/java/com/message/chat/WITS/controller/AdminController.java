package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> getDashboard() {
        // TODO: Implement admin dashboard logic
        return ResponseEntity.ok("Admin dashboard.");
    }

    @PostMapping("/moderate/user")
    public ResponseEntity<String> moderateUser(@RequestBody String moderation) {
        // TODO: Implement user moderation logic
        return ResponseEntity.ok("User moderated.");
    }
}
