package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "friend_requests")
public class FriendRequest {
    @Id
    private String id;
    private String senderId;
    private String receiverId;
    private RequestStatus status;
    private LocalDateTime timestamp;

    public enum RequestStatus {
        PENDING, ACCEPTED, REJECTED
    }
}
