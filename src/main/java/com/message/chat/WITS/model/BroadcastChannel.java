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
@Document(collection = "broadcast_channels")
public class BroadcastChannel {
    @Id
    private String id;

    private String name;
    private String description;
    private String avatarUrl;

    private String ownerId; // Creator of the channel

    @Builder.Default
    private Set<String> adminIds = new HashSet<>(); // Can post

    // Instead of storing all subscribers in an array (could be millions),
    // modern systems store subscriber count and use a separate collection for edge
    // links
    // But for MVP scale we track a set:
    @Builder.Default
    private Set<String> subscriberIds = new HashSet<>();

    private boolean isPublic; // if false, needs an invite link
    private String inviteLink;

    private LocalDateTime createdAt;

    @Builder.Default
    private boolean commentsEnabled = true;
}
