package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "official_accounts")
public class OfficialAccount {
    @Id
    private String id;

    private String name;
    private String description;
    private String category; // BRAND, CREATOR, SUPPORT, STORE

    private String ownerUserId; // Corresponds to standard User ID
    private String verificationBadgeType; // "BLUE_CHECK", "ENTERPRISE", "NONE"

    @Builder.Default
    private Set<String> operatorIds = new HashSet<>(); // employees who can respond to chats

    @Builder.Default
    private Set<String> subscriberIds = new HashSet<>();

    // Auto-reply definitions for customer support
    @Builder.Default
    private java.util.Map<String, String> autoReplies = new java.util.HashMap<>();
    private String defaultWelcomeMessage;

    // Linked Mini Apps built by this business
    @Builder.Default
    private List<String> linkedMiniAppIds = new ArrayList<>();

    private LocalDateTime createdAt;
}
