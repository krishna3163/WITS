package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Post;
import com.message.chat.WITS.model.Moment;
import com.message.chat.WITS.model.Story;
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

    // --- Posts ---

    @PostMapping("/post")
    public ResponseEntity<Post> createPost(
            @RequestParam UUID authorId,
            @RequestBody String content) {
        return ResponseEntity.ok(feedService.createPost(authorId, content));
    }

    @PostMapping("/posts")
    public ResponseEntity<Post> createPostAdvanced(
            @RequestParam UUID userId,
            @RequestParam String content,
            @RequestParam(required = false) Post.PostType type,
            @RequestParam(required = false) List<String> mediaUrls) {
        return ResponseEntity.ok(feedService.createPost(userId, content, type, mediaUrls));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Post>> getFeed(@PathVariable UUID userId) {
        return ResponseEntity.ok(feedService.getFeed(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(feedService.getAllPosts());
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<Post> likePost(
            @PathVariable UUID postId,
            @RequestParam UUID likerId) {
        return ResponseEntity.ok(feedService.likePost(postId, likerId));
    }

    // --- Moments ---

    @PostMapping("/moments")
    public ResponseEntity<Moment> createMoment(
            @RequestParam String authorId,
            @RequestParam String caption,
            @RequestParam(required = false) List<String> imageUrls,
            @RequestParam(required = false) String videoUrl,
            @RequestParam(defaultValue = "false") boolean isPublic,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(feedService.createMoment(authorId, caption, imageUrls, videoUrl, isPublic, location));
    }

    @PostMapping("/moments/{momentId}/like")
    public ResponseEntity<Moment> likeMoment(
            @PathVariable String momentId,
            @RequestParam String likerId) {
        return ResponseEntity.ok(feedService.likeMoment(momentId, likerId));
    }

    @PostMapping("/moments/{momentId}/comment")
    public ResponseEntity<Moment> commentOnMoment(
            @PathVariable String momentId,
            @RequestParam String authorId,
            @RequestBody String content) {
        return ResponseEntity.ok(feedService.commentOnMoment(momentId, authorId, content));
    }

    // --- Stories ---

    @PostMapping("/stories")
    public ResponseEntity<Story> createStory(
            @RequestParam String authorId,
            @RequestParam String mediaUrl,
            @RequestParam(required = false) String caption) {
        return ResponseEntity.ok(feedService.createStory(authorId, mediaUrl, caption));
    }

    @GetMapping("/stories/user/{authorId}")
    public ResponseEntity<List<Story>> getActiveStories(@PathVariable String authorId) {
        return ResponseEntity.ok(feedService.getActiveStories(authorId));
    }

    @PostMapping("/stories/{storyId}/view")
    public ResponseEntity<Story> viewStory(
            @PathVariable String storyId,
            @RequestParam String viewerId) {
        return ResponseEntity.ok(feedService.viewStory(storyId, viewerId));
    }
}
