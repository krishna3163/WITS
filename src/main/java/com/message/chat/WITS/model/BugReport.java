package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "bug_reports")
public class BugReport {
    @Id
    private String id;

    private String reporterUserId; // User who is reporting the bug
    private String developerId; // Tends to be Krishna's system User ID

    private String title;
    private String description;

    @Builder.Default
    private List<String> screenshotUrls = new ArrayList<>();

    private BugStatus status;
    private LocalDateTime timestamp;

    public enum BugStatus {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED
    }
}
