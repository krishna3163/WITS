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
@Document(collection = "offline_queues")
public class OfflineMessageQueue {
    @Id
    private String id;

    // The user who is offline and needs to receive this message
    private String recipientId;

    // The actual message content stored until delivered
    private Message message;

    private LocalDateTime queuedAt;

    @Builder.Default
    private boolean isDelivered = false;
}
