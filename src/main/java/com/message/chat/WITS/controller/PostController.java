package com.message.chat.WITS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody String post) {
        // TODO: Implement create post logic
        return ResponseEntity.ok("Post created.");
    }

    @GetMapping("/{postId}")
    public ResponseEntity<String> getPost(@PathVariable String postId) {
        // TODO: Implement get post logic
        return ResponseEntity.ok("Post " + postId);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable String postId) {
        // TODO: Implement like post logic
        return ResponseEntity.ok("Post " + postId + " liked.");
    }

    @PostMapping("/{postId}/comment")
    public ResponseEntity<String> commentOnPost(@PathVariable String postId, @RequestBody String comment) {
        // TODO: Implement comment on post logic
        return ResponseEntity.ok("Comment added to post " + postId);
    }
}
