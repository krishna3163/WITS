package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "stories")
public class Story {
    @Id
    private String id;
    private String authorId;
    private String mediaUrl;
    private String caption;
    private LocalDateTime timestamp;
    private LocalDateTime expiryTime; // Auto-delete after 24h

    @Builder.Default
    private Set<String> visibleToUserIds = new HashSet<>(); // If empty, visible to all friends

    @Builder.Default
    private Set<String> viewerIds = new HashSet<>();

    // Status Engagement Feature
    @Builder.Default
    private Set<String> likerIds = new HashSet<>();
    @Builder.Default
    private java.util.List<Comment> comments = new java.util.ArrayList<>();

    @Builder.Default
    private boolean isReshareable = true;
    private String originalStoryId; // If this is a reshare, points to original
}
