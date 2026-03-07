package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "calls")
public class Call {
    @Id
    private String id;
    private String initiatorId;
    @Builder.Default
    private Set<String> participantIds = new HashSet<>();

    private CallType type; // VOICE, VIDEO
    private CallStatus status; // INITIATED, ONGOING, COMPLETED, MISSED, REJECTED

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String channelName; // For WebRTC signaling (e.g., Agora channel or Jitsi room)

    private boolean isGroupCall;
    private String groupId; // If it's a group call

    public enum CallType {
        VOICE, VIDEO
    }

    public enum CallStatus {
        INITIATED, ONGOING, COMPLETED, MISSED, REJECTED
    }
}
