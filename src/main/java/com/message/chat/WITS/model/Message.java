package com.message.chat.WITS.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    private UUID id;

    private String channelId;
    private String serverId;
    private UUID conversationId;
    private UUID senderId;
    private LocalDateTime timestamp;
    private LocalDateTime scheduledAt;

    public enum MessageStatus {
        SENT,
        DELIVERED,
        READ,
        DELETED
    }

    private MessageStatus status;
    private LocalDateTime expiryTime;

    public enum MessageType {
        TEXT,
        IMAGE,
        VIDEO,
        AUDIO,
        LOCATION,
        FILE,
        SNAP_PHOTO
    }

    private String content;
    private MessageType messageType;
    private String mediaUrl;
    private Instant createdAt;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getConversationId() {
        return conversationId;
    }

    public void setConversationId(UUID conversationId) {
        this.conversationId = conversationId;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getServerId() {
        return serverId;
    }

    public void setServerId(String serverId) {
        this.serverId = serverId;
    }

    private boolean isSnap;
    private boolean screenshotDetected;

    public boolean isSnap() {
        return isSnap;
    }

    public void setSnap(boolean snap) {
        isSnap = snap;
    }

    public boolean isScreenshotDetected() {
        return screenshotDetected;
    }

    public void setScreenshotDetected(boolean screenshotDetected) {
        this.screenshotDetected = screenshotDetected;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public MessageStatus getStatus() {
        return status;
    }

    public void setStatus(MessageStatus status) {
        this.status = status;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }
}
