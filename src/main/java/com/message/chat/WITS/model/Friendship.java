package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "friendships")
public class Friendship {
    @Id
    private String id;
    private String userId1;
    private String userId2;
    private LocalDateTime establishedAt;

    // Streak logic
    @Builder.Default
    private int streakCount = 0;
    private LocalDateTime lastSnapTimestamp;

    // Map / Location sharing
    private boolean shareLocation; // Global share for this friend
    private ShareLevel shareLevel; // GHOST, FRIENDS, ONLY_THESE

    public enum ShareLevel {
        GHOST, FRIENDS, SELECTED
    }
}
