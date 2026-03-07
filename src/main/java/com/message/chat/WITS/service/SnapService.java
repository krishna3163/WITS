package com.message.chat.WITS.service;

import com.message.chat.WITS.model.*;
import com.message.chat.WITS.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SnapService {
    private final MessageRepository messageRepository;
    private final StoryRepository storyRepository;
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public void sendSnap(String senderId, String recipientId, String mediaUrl, Message.MessageType type,
            int expiryMinutes) {
        Message snap = Message.builder()
                .senderId(java.util.UUID.fromString(senderId))
                .conversationId(java.util.UUID.fromString(recipientId)) // Mapping recipient to conversationId for now
                .mediaUrl(mediaUrl)
                .messageType(type)
                .isSnap(true)
                .timestamp(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(expiryMinutes))
                .build();
        messageRepository.save(snap);
        updateStreak(senderId, recipientId);
    }

    private void updateStreak(String userId1, String userId2) {
        String id1 = userId1.compareTo(userId2) < 0 ? userId1 : userId2;
        String id2 = userId1.compareTo(userId2) < 0 ? userId2 : userId1;

        Optional<Friendship> friendshipOpt = friendshipRepository.findByUserId1AndUserId2(id1, id2);
        if (friendshipOpt.isPresent()) {
            Friendship friendship = friendshipOpt.get();
            LocalDateTime now = LocalDateTime.now();
            if (friendship.getLastSnapTimestamp() == null
                    || friendship.getLastSnapTimestamp().isBefore(now.minusDays(1))) {
                if (friendship.getLastSnapTimestamp() != null
                        && friendship.getLastSnapTimestamp().isAfter(now.minusDays(2))) {
                    friendship.setStreakCount(friendship.getStreakCount() + 1);
                } else {
                    friendship.setStreakCount(1);
                }
                friendship.setLastSnapTimestamp(now);
                friendshipRepository.save(friendship);
            }
        }
    }

    public void postStory(String userId, String mediaUrl, String caption, int expiryHours) {
        Story story = Story.builder()
                .authorId(userId)
                .mediaUrl(mediaUrl)
                .caption(caption)
                .timestamp(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusHours(expiryHours))
                .build();
        storyRepository.save(story);
    }

    public void likeStory(String storyId, String userId) {
        storyRepository.findById(storyId).ifPresent(story -> {
            story.getLikerIds().add(userId);
            storyRepository.save(story);
        });
    }

    public void reshareStory(String originalStoryId, String userId) {
        storyRepository.findById(originalStoryId).ifPresent(original -> {
            if (original.isReshareable()) {
                Story reshare = Story.builder()
                        .authorId(userId)
                        .mediaUrl(original.getMediaUrl())
                        .caption("Reshared: " + (original.getCaption() != null ? original.getCaption() : ""))
                        .timestamp(LocalDateTime.now())
                        .expiryTime(LocalDateTime.now().plusHours(24))
                        .originalStoryId(originalStoryId)
                        .build();
                storyRepository.save(reshare);
            }
        });
    }

    public void updateLocation(String userId, double lat, double lon) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLatitude(lat);
            user.setLongitude(lon);
            user.setLastLocationUpdate(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    @Scheduled(fixedRate = 60000) // Every minute
    public void cleanupExpiredContent() {
        LocalDateTime now = LocalDateTime.now();

        // Cleanup expired messages
        // Note: Real production app would use TTL indexes in MongoDB
        List<Message> expiredMessages = messageRepository.findAll().stream()
                .filter(m -> m.getExpiryTime() != null && m.getExpiryTime().isBefore(now))
                .toList();
        messageRepository.deleteAll(expiredMessages);

        // Cleanup expired stories
        List<Story> expiredStories = storyRepository.findByExpiryTimeBefore(now);
        storyRepository.deleteAll(expiredStories);
    }

    public void notifyScreenshot(String messageId) {
        messageRepository.findById(java.util.UUID.fromString(messageId)).ifPresent(m -> {
            m.setScreenshotDetected(true);
            messageRepository.save(m);
            // Send real-time notification logic would go here
        });
    }
}
