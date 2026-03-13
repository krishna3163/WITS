package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    @PostMapping
    public ResponseEntity<String> createCommunity(@RequestBody String community) {
        // TODO: Implement create community logic
        return ResponseEntity.ok("Community created.");
    }

    @GetMapping("/{communityId}")
    public ResponseEntity<String> getCommunity(@PathVariable String communityId) {
        // TODO: Implement get community logic
        return ResponseEntity.ok("Community " + communityId);
    }
}
