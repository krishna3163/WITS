package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Community;
import com.message.chat.WITS.model.Post;
import com.message.chat.WITS.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
public class CommunityController {
    private final CommunityService communityService;

    @GetMapping
    public List<Community> getAllCommunities() {
        return communityService.getAllCommunities();
    }

    @PostMapping
    public Community createCommunity(@RequestBody Community community) {
        return communityService.createCommunity(community);
    }

    @GetMapping("/{id}/posts")
    public List<Post> getCommunityPosts(@PathVariable UUID id) {
        return communityService.getCommunityPosts(id);
    }

    @PostMapping("/{id}/posts")
    public Post createCommunityPost(@PathVariable UUID id, @RequestBody Post post) {
        return communityService.createCommunityPost(id, post);
    }
}
