package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "tweets")
public class Tweet {
    @Id
    private String id;
    private String authorId;
    private String content;
    private List<String> mediaUrls;
    private String gifUrl;

    @Builder.Default
    private Set<String> hashtagNames = new HashSet<>();

    private List<String> links;
    private Poll poll;

    private LocalDateTime timestamp;

    @Builder.Default
    private java.util.Set<String> upvoterIds = new java.util.HashSet<>();
    @Builder.Default
    private java.util.Set<String> downvoterIds = new java.util.HashSet<>();
    @Builder.Default
    private Set<String> reposterIds = new HashSet<>();
    @Builder.Default
    private Set<String> reporterIds = new HashSet<>();

    private String communityId;

    private String originalTweetId; // For reposts (retweets)
    private boolean isRepost;

    @Builder.Default
    private List<Comment> comments = new java.util.ArrayList<>();
}
