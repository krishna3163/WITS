package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByConversationIdOrderByCreatedAtAsc(UUID conversationId);
    List<Message> findByChannelIdOrderByCreatedAtAsc(String channelId);
    List<Message> findByContentContainingIgnoreCase(String content);
}
