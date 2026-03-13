package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calls")
public class CallController {

    @PostMapping("/voice")
    public ResponseEntity<String> makeVoiceCall(@RequestBody String call) {
        // TODO: Implement voice call logic
        return ResponseEntity.ok("Voice call initiated.");
    }

    @PostMapping("/video")
    public ResponseEntity<String> makeVideoCall(@RequestBody String call) {
        // TODO: Implement video call logic
        return ResponseEntity.ok("Video call initiated.");
    }
}
