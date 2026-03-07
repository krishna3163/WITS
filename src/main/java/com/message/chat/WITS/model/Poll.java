package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "polls")
public class Poll {
    @Id
    private String id;
    private String groupId;
    private String creatorId;
    private String question;
    private List<String> options;
    @Builder.Default
    private Map<String, Integer> votes = new HashMap<>(); // optionIndex -> count
    private LocalDateTime createdAt;
}
