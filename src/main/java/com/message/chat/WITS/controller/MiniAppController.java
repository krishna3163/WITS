package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/miniapps")
public class MiniAppController {

    @GetMapping
    public ResponseEntity<String> getMiniApps() {
        // TODO: Implement get mini-apps logic
        return ResponseEntity.ok("List of mini-apps.");
    }

    @PostMapping("/{appId}/install")
    public ResponseEntity<String> installMiniApp(@PathVariable String appId) {
        // TODO: Implement install mini-app logic
        return ResponseEntity.ok("Mini-app " + appId + " installed.");
    }
}
