package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Community;
import com.message.chat.WITS.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;

    public Community createCommunity(String name, String description, String creatorId) {
        Community community = Community.builder()
                .name(name)
                .description(description)
                .subscriberCount(1)
                .isPrivate(false)
                .build();
        community.getModeratorUserIds().add(creatorId);
        community.getMemberUserIds().add(creatorId);
        return communityRepository.save(community);
    }

    public void joinCommunity(String communityId, String userId) {
        communityRepository.findById(communityId).ifPresent(community -> {
            if (!community.getMemberUserIds().contains(userId)) {
                community.getMemberUserIds().add(userId);
                community.setSubscriberCount(community.getSubscriberCount() + 1);
                communityRepository.save(community);
            }
        });
    }

    public void leaveCommunity(String communityId, String userId) {
        communityRepository.findById(communityId).ifPresent(community -> {
            if (community.getMemberUserIds().contains(userId)) {
                community.getMemberUserIds().remove(userId);
                community.setSubscriberCount(community.getSubscriberCount() - 1);
                communityRepository.save(community);
            }
        });
    }

    public void addRule(String communityId, String rule, String moderatorId) {
        communityRepository.findById(communityId).ifPresent(community -> {
            if (community.getModeratorUserIds().contains(moderatorId)) {
                community.getRules().add(rule);
                communityRepository.save(community);
            }
        });
    }

    public void addCategory(String communityId, String category, String moderatorId) {
        communityRepository.findById(communityId).ifPresent(community -> {
            if (community.getModeratorUserIds().contains(moderatorId)) {
                community.getCategories().add(category);
                communityRepository.save(community);
            }
        });
    }

    public List<Community> getRecommendedCommunities() {
        return communityRepository.findTop10ByOrderBySubscriberCountDesc();
    }

    public Optional<Community> getCommunity(String communityId) {
        return communityRepository.findById(communityId);
    }
}
