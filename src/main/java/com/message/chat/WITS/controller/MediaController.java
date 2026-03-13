package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    @PostMapping("/upload")
    public ResponseEntity<String> uploadMedia(@RequestBody String media) {
        // TODO: Implement media upload logic
        return ResponseEntity.ok("Media uploaded.");
    }
}
