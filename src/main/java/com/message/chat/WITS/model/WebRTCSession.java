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
@Document(collection = "webrtc_sessions")
public class WebRTCSession {
    @Id
    private String id;

    private String initiatorId; // Person who started the call
    private String recipientId; // Target person (for 1v1)
    private String groupId; // Target group (for Voice/Video Rooms)

    private CallType callType;
    private CallStatus status;

    @Builder.Default
    private Set<String> activeParticipants = new HashSet<>();

    // Using a simple JSON format to hold SDP (Session Description Protocol)
    // Offers/Answers
    // and ICE candidates for establishing P2P connections via STUN/TURN
    private String offerSdp;
    private String answerSdp;

    @Builder.Default
    private java.util.List<String> callerIceCandidates = new java.util.ArrayList<>();
    @Builder.Default
    private java.util.List<String> calleeIceCandidates = new java.util.ArrayList<>();

    // Analytics/Record Keeping
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private boolean isRecorded;

    public enum CallType {
        AUDIO_ONLY,
        VIDEO,
        SCREEN_SHARE,
        LIVE_STREAM
    }

    public enum CallStatus {
        RINGING,
        ONGOING,
        COMPLETED,
        MISSED,
        REJECTED,
        FAILED
    }
}
