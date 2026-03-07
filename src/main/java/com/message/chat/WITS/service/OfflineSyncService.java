package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.model.OfflineMessageQueue;
import com.message.chat.WITS.repository.OfflineMessageQueueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfflineSyncService {

    private final OfflineMessageQueueRepository queueRepository;

    /**
     * Called by the WebSocket or Kafka listener when a message comes in but
     * the recipient's WebSocket connection is completely offline.
     */
    public OfflineMessageQueue queueMessage(String recipientId, Message message) {
        OfflineMessageQueue queuedMsg = OfflineMessageQueue.builder()
                .recipientId(recipientId)
                .message(message)
                .queuedAt(LocalDateTime.now())
                .isDelivered(false)
                .build();
        return queueRepository.save(queuedMsg);
    }

    /**
     * Called the moment a user establishes a new WebSocket connection.
     * Fetches all undelivered messages, marks them as delivered, and returns them
     * for immediate pushing.
     */
    public List<Message> syncOfflineMessages(String userId) {
        List<OfflineMessageQueue> pending = queueRepository
                .findByRecipientIdAndIsDeliveredFalseOrderByQueuedAtAsc(userId);

        List<Message> syncPayload = pending.stream()
                .map(OfflineMessageQueue::getMessage)
                .collect(Collectors.toList());

        // Mark all as delivered and save
        pending.forEach(q -> q.setDelivered(true));
        queueRepository.saveAll(pending);

        // Alternatively, we could delete them directly to save storage:
        // queueRepository.deleteAll(pending);

        return syncPayload;
    }
}
