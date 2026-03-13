package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Post;
import com.message.chat.WITS.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class FeedService {

    private final PostRepository postRepository;
    private final com.message.chat.WITS.repository.MomentRepository momentRepository;
    private final com.message.chat.WITS.repository.StoryRepository storyRepository;

    public FeedService(PostRepository postRepository,
                       com.message.chat.WITS.repository.MomentRepository momentRepository,
                       com.message.chat.WITS.repository.StoryRepository storyRepository) {
        this.postRepository = postRepository;
        this.momentRepository = momentRepository;
        this.storyRepository = storyRepository;
    }

    @Transactional
    public Post createPost(Post post) {
        if (post.getId() == null) {
            post.setId(UUID.randomUUID());
            post.setCreatedAt(Instant.now());
            post.setTimestamp(java.time.LocalDateTime.now());
        }
        return postRepository.save(post);
    }

    @Transactional
    public Post createPost(UUID authorId, String content) {
        Post post = new Post();
        post.setId(UUID.randomUUID());
        post.setUserId(authorId);
        post.setAuthorId(authorId.toString());
        post.setContent(content);
        post.setType(Post.PostType.TEXT);
        post.setAuthorType(Post.PostAuthorType.USER);
        post.setCreatedAt(Instant.now());
        post.setTimestamp(java.time.LocalDateTime.now());

        return postRepository.save(post);
    }

    @Transactional
    public Post createPost(UUID userId, String content, Post.PostType type, List<String> mediaUrls) {
        Post post = Post.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .authorId(userId.toString())
                .content(content)
                .type(type != null ? type : Post.PostType.TEXT)
                .authorType(Post.PostAuthorType.USER)
                .mediaUrls(mediaUrls != null ? mediaUrls : List.of())
                .createdAt(Instant.now())
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return postRepository.save(post);
    }

    @Transactional
    public Post likePost(UUID postId, UUID likerId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getLikerIds().contains(likerId)) {
            post.getLikerIds().add(likerId);
            return postRepository.save(post);
        }
        return post; // Already liked
    }

    // --- Instagram / WeChat Style Moments ---

    @Transactional
    public com.message.chat.WITS.model.Moment createMoment(String authorId, String caption, List<String> imageUrls, String videoUrl, boolean isPublic, String location) {
        com.message.chat.WITS.model.Moment moment = com.message.chat.WITS.model.Moment.builder()
                .authorId(authorId)
                .caption(caption)
                .imageUrls(imageUrls != null ? imageUrls : List.of())
                .videoUrl(videoUrl)
                .isPublic(isPublic)
                .location(location)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return momentRepository.save(moment);
    }

    @Transactional
    public com.message.chat.WITS.model.Moment likeMoment(String momentId, String likerId) {
        com.message.chat.WITS.model.Moment moment = momentRepository.findById(momentId)
                .orElseThrow(() -> new RuntimeException("Moment not found"));
        moment.getLikedBy().add(likerId);
        return momentRepository.save(moment);
    }

    @Transactional
    public com.message.chat.WITS.model.Moment commentOnMoment(String momentId, String authorId, String content) {
        com.message.chat.WITS.model.Moment moment = momentRepository.findById(momentId)
                .orElseThrow(() -> new RuntimeException("Moment not found"));

        com.message.chat.WITS.model.Comment comment = com.message.chat.WITS.model.Comment.builder()
                .id(UUID.randomUUID().toString())
                .authorId(authorId)
                .content(content)
                .timestamp(java.time.LocalDateTime.now())
                .build();

        moment.getComments().add(comment);
        return momentRepository.save(moment);
    }

    // --- Snapchat / Instagram / Facebook Style Stories ---

    @Transactional
    public com.message.chat.WITS.model.Story createStory(String authorId, String mediaUrl, String caption) {
        com.message.chat.WITS.model.Story story = com.message.chat.WITS.model.Story.builder()
                .authorId(authorId)
                .mediaUrl(mediaUrl)
                .caption(caption)
                .timestamp(java.time.LocalDateTime.now())
                .expiryTime(java.time.LocalDateTime.now().plusHours(24)) // 24 hour expiry
                .build();
        return storyRepository.save(story);
    }

    public List<com.message.chat.WITS.model.Story> getActiveStories(String authorId) {
        return storyRepository.findByAuthorIdAndExpiryTimeAfter(authorId, java.time.LocalDateTime.now());
    }

    @Transactional
    public com.message.chat.WITS.model.Story viewStory(String storyId, String viewerId) {
        com.message.chat.WITS.model.Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));
        story.getViewerIds().add(viewerId);
        return storyRepository.save(story);
    }

    // Scheduled task to clean up old stories
    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 3600000) // Hourly
    @Transactional
    public void cleanupExpiredStories() {
        List<com.message.chat.WITS.model.Story> expired = storyRepository.findByExpiryTimeBefore(java.time.LocalDateTime.now());
        if (!expired.isEmpty()) {
            storyRepository.deleteAll(expired);
        }
    }

    public List<Post> getFeed(UUID userId) {
        // Simple implementation: retrieve own posts or an aggregated feed later
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Post> getFeedForUser(com.message.chat.WITS.model.User user) {
        // Simple implementation based on user string ID mapping to UUID
        try {
            return getFeed(UUID.fromString(user.getId()));
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
