package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "chat_groups")
public class ChatGroup {
    @Id
    private String id;
    private String name;
    private String description;
    private String imageUrl;

    @Builder.Default
    private Map<String, GroupRole> members = new HashMap<>(); // userId -> role
    @Builder.Default
    private Map<String, String> memberNicknames = new HashMap<>(); // userId -> nickname

    // Telegram/Discord-style additions
    private GroupVisibility visibility; // PUBLIC, PRIVATE, SECRET
    private String inviteLink; // For public groups (@username)
    private String pinnedMessageId;

    // Live Sessions
    private boolean isLiveSessionActive;
    private String liveSessionId;

    @Builder.Default
    private Set<String> botUserIds = new HashSet<>();

    public enum GroupVisibility {
        PUBLIC, PRIVATE, SECRET
    }

    // Join Request Feature
    @Builder.Default
    private boolean requiresApproval = false;
    @Builder.Default
    private Set<String> pendingApprovalUserIds = new HashSet<>();

    private int slowModeDelaySeconds; // Seconds between messages
    @Builder.Default
    private java.util.List<Topic> topics = new java.util.ArrayList<>();
}
