package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "trending_topics")
public class TrendingTopic {
    @Id
    private String id;
    private String hashtag; // e.g., "#WITS_App"
    private long usageCount;
    private LocalDateTime windowStart; // To calculate trending in last X hours
    private LocalDateTime lastUsedAt;
}
