package com.message.chat.WITS.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "miniapps")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MiniApp {

    @Id
    private UUID id;

    private UUID developerId;
    private String name;
    private String description;
    private String iconUrl;
    private String appUrl;
    private Instant createdAt;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getDeveloperId() {
        return developerId;
    }

    public void setDeveloperId(UUID developerId) {
        this.developerId = developerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getAppUrl() {
        return appUrl;
    }

    public void setAppUrl(String appUrl) {
        this.appUrl = appUrl;
    }

    public enum AppCategory {
        TAXI,
        SHOPPING,
        FOOD,
        FINANCE,
        UTILITY,
        GAME,
        OTHER
    }

    private AppCategory category;

    public AppCategory getCategory() {
        return category;
    }

    public void setCategory(AppCategory category) {
        this.category = category;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
