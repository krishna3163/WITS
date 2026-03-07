package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "channels")
public class Channel {
    @Id
    private String id;
    private String serverId;
    private String name;
    private ChannelType type;
    private String category; // e.g., "Text Channels", "Voice Channels"
    private int position;

    // roleId or userId -> Set of Permissions that are allowed/denied
    @Builder.Default
    private Map<String, Set<Permission>> permissionOverrides = new java.util.HashMap<>();

    // Discord-style enhancements
    private boolean isPrivate;
    private boolean isSecret; // Visible only to specific roles

    // Broadcast Channel Features
    private long subscribersCount;
    @Builder.Default
    private Map<String, Long> postViews = new HashMap<>(); // messageId -> views
    private boolean canComment;

    @Builder.Default
    private Map<String, Object> analytics = new HashMap<>(); // e.g., weekly growth

    // Live Sessions
    private boolean isLiveSessionActive;
    private String liveSessionId;
    private String liveAudioSpaceId;
}
