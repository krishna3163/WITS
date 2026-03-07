package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.WebRTCSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebRTCSessionRepository extends MongoRepository<WebRTCSession, String> {
    List<WebRTCSession> findByInitiatorIdOrderByStartedAtDesc(String initiatorId);

    List<WebRTCSession> findByRecipientIdOrderByStartedAtDesc(String recipientId);

    List<WebRTCSession> findByGroupIdOrderByStartedAtDesc(String groupId);
}
