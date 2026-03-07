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
@Document(collection = "events")
public class Event {
    @Id
    private String id;
    private String groupId;
    private String creatorId;
    private String title;
    private String description;
    private LocalDateTime eventTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
