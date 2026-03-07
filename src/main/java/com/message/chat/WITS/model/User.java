package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String phoneNumber; // Added for contact discovery
    private String contactQrCode; // Added for QR based friend adding
    private String password; // Hash in production
    private String profilePictureUrl;
    private String fullName;
    private java.time.LocalDate dob;

    // Social & Profile enhancements
    private String bio;
    private String education; // e.g., "MIT - CS"
    private String work; // e.g., "Senior Dev at Google"

    @Builder.Default
    private java.util.List<String> photoGalleryUrls = new java.util.ArrayList<>();

    @Builder.Default
    private Set<String> friendIds = new HashSet<>();

    @Builder.Default
    private Set<String> followerIds = new HashSet<>();

    @Builder.Default
    private Set<String> followingIds = new HashSet<>();

    @Builder.Default
    private java.util.List<String> highlightIds = new java.util.ArrayList<>(); // Collections of stories

    @Builder.Default
    private java.util.List<String> snapIds = new java.util.ArrayList<>(); // Recent snaps

    @Builder.Default
    private Set<String> roles = new HashSet<>(); // System roles: ROLE_USER, ROLE_ADMIN

    private double latitude;
    private double longitude;
    private java.time.LocalDateTime lastLocationUpdate;

    // Presence Feature
    @Builder.Default
    private boolean isOnline = false;
    private java.time.LocalDateTime lastSeenAt;
    @Builder.Default
    private boolean isTyping = false;
    private String currentTypingInId; // ID of the chat/group currently typing in

    @Builder.Default
    private Set<String> pinnedConversationIds = new HashSet<>();
    @Builder.Default
    private Set<String> mutedConversationIds = new HashSet<>();

    // Internal privacy settings class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserPrivacy {
        @Builder.Default
        private PrivacySetting namePrivacy = PrivacySetting.PUBLIC;
        @Builder.Default
        private PrivacySetting emailPrivacy = PrivacySetting.PRIVATE;
        @Builder.Default
        private PrivacySetting dobPrivacy = PrivacySetting.FRIENDS;
        @Builder.Default
        private PrivacySetting bioPrivacy = PrivacySetting.PUBLIC;
        @Builder.Default
        private PrivacySetting profilePicPrivacy = PrivacySetting.PUBLIC;
    }

    @Builder.Default
    private UserPrivacy privacy = new UserPrivacy();
}
