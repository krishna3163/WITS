package com.message.chat.WITS.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ElementCollection;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "posts")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    private UUID id;

    private UUID userId;
    private String content;
    private Instant createdAt;

    // Support for FeedView requirements
    public enum PostType {
        TEXT, IMAGE, VIDEO, LINK
    }

    public enum PostAuthorType {
        USER, PAGE, GROUP
    }

    private PostType type;
    private PostAuthorType authorType;
    private String authorId;
    private LocalDateTime timestamp;
    private UUID groupId;

    @ElementCollection
    @Builder.Default
    private List<String> mediaUrls = new ArrayList<>();

    @ElementCollection
    @Builder.Default
    private List<UUID> likerIds = new ArrayList<>();

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public PostType getType() {
        return type;
    }

    public void setType(PostType type) {
        this.type = type;
    }

    public PostAuthorType getAuthorType() {
        return authorType;
    }

    public void setAuthorType(PostAuthorType authorType) {
        this.authorType = authorType;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public List<UUID> getLikerIds() {
        return likerIds;
    }

    public void setLikerIds(List<UUID> likerIds) {
        this.likerIds = likerIds;
    }

    public UUID getGroupId() {
        return groupId;
    }

    public void setGroupId(UUID groupId) {
        this.groupId = groupId;
    }
}
