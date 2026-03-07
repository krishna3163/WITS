package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "communities")
public class Community {
    @Id
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private String bannerUrl;

    @Builder.Default
    private List<String> rules = new ArrayList<>();

    @Builder.Default
    private Set<String> moderatorUserIds = new HashSet<>();

    @Builder.Default
    private List<String> categories = new ArrayList<>(); // Post categories within community

    @Builder.Default
    private Set<String> memberUserIds = new HashSet<>();

    private long postCount;
    private long subscriberCount;

    private boolean isPrivate;
}
