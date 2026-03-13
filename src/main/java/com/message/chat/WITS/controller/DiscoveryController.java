package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discover")
public class DiscoveryController {

    @GetMapping("/trending")
    public ResponseEntity<String> getTrending() {
        // TODO: Implement get trending logic
        return ResponseEntity.ok("Trending topics.");
    }

    @GetMapping("/search")
    public ResponseEntity<String> search(@RequestParam String query) {
        // TODO: Implement search logic
        return ResponseEntity.ok("Search results for " + query);
    }
}
