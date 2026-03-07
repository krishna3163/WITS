package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SecretChatService {

    private final MessageRepository messageRepository;

    public Message sendSecretMessage(String senderId, String recipientId, String content, int ttlSeconds) {
        Message message = Message.builder()
                .senderId(java.util.UUID.fromString(senderId))
                .conversationId(java.util.UUID.fromString(recipientId))
                .content(content)
                .messageType(Message.MessageType.TEXT)
                .timestamp(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusSeconds(ttlSeconds))
                .status(Message.MessageStatus.SENT)
                .build();
        return messageRepository.save(message);
    }

    /**
     * Cron job that runs every 60 seconds to find and permanently delete
     * messages that have passed their expiryTime.
     */
    @Scheduled(fixedRate = 60000)
    public void cleanupExpiredMessages() {
        // In a real app, a custom Mongo query finding all messages where expiryTime <
        // NOW()
        // would be performed.
        List<Message> allMessages = messageRepository.findAll();
        for (Message msg : allMessages) {
            if (msg.getExpiryTime() != null && LocalDateTime.now().isAfter(msg.getExpiryTime())) {
                messageRepository.delete(msg);
            }
        }
    }
}
