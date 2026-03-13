package com.message.chat.WITS.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "blocklist")
public class BlocklistEntry {

    @Id
    private UUID userId;

    private UUID blockedUserId;
    private Instant createdAt;

    // Getters and Setters

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getBlockedUserId() {
        return blockedUserId;
    }

    public void setBlockedUserId(UUID blockedUserId) {
        this.blockedUserId = blockedUserId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
