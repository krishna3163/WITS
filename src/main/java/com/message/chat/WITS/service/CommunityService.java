package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Community;
import com.message.chat.WITS.model.Post;
import com.message.chat.WITS.repository.CommunityRepository;
import com.message.chat.WITS.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;

    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Community createCommunity(Community community) {
        if (community.getId() == null) {
            community.setId(UUID.randomUUID().toString());
        }
        return communityRepository.save(community);
    }

    public List<Post> getCommunityPosts(UUID communityId) {
        // Find posts where group_id matches communityId (using chat_groups table
        // pattern)
        return postRepository.findByGroupIdOrderByCreatedAtDesc(communityId);
    }

    public Post createCommunityPost(UUID communityId, Post post) {
        post.setGroupId(communityId);
        post.setAuthorType(Post.PostAuthorType.USER);
        if (post.getId() == null) {
            post.setId(UUID.randomUUID());
        }
        return postRepository.save(post);
    }
}
