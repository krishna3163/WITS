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
@Document(collection = "group_action_requests")
public class GroupActionRequest {
    @Id
    private String id;
    private String groupId;
    private String requesterId;
    private String actionType; // "CREATE_POLL", "CREATE_EVENT", "CREATE_REMINDER", etc.
    private String details;
    private RequestStatus status;
    private LocalDateTime timestamp;

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }
}
