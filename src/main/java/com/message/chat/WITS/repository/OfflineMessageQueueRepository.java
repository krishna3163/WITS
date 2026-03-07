package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.OfflineMessageQueue;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfflineMessageQueueRepository extends MongoRepository<OfflineMessageQueue, String> {
    List<OfflineMessageQueue> findByRecipientIdAndIsDeliveredFalseOrderByQueuedAtAsc(String recipientId);
}
