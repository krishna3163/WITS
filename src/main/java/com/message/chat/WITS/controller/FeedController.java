package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Post;
import com.message.chat.WITS.service.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @PostMapping("/post")
    public ResponseEntity<Post> createPost(
            @RequestParam UUID authorId,
            @RequestBody String content) {
        return ResponseEntity.ok(feedService.createPost(authorId, content));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Post>> getFeed(@PathVariable UUID userId) {
        return ResponseEntity.ok(feedService.getFeed(userId));
    }
}
