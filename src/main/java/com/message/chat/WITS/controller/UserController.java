package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{userId}/profile")
    public ResponseEntity<String> getProfile(@PathVariable String userId) {
        // TODO: Implement get profile logic
        return ResponseEntity.ok("Profile for user " + userId);
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<String> updateProfile(@PathVariable String userId, @RequestBody String profile) {
        // TODO: Implement update profile logic
        return ResponseEntity.ok("Profile for user " + userId + " updated.");
    }
}
