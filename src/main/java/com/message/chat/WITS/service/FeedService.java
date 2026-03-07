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

    public FeedService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional
    public Post createPost(Post post) {
        if (post.getId() == null) {
            post.setId(UUID.randomUUID());
            post.setCreatedAt(Instant.now());
        }
        return postRepository.save(post);
    }

    @Transactional
    public Post createPost(UUID authorId, String content) {
        Post post = new Post();
        post.setId(UUID.randomUUID());
        post.setUserId(authorId);
        post.setContent(content);
        post.setCreatedAt(Instant.now());

        return postRepository.save(post);
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
}
