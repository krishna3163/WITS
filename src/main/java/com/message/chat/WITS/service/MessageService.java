package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.model.Conversation;
import com.message.chat.WITS.repository.MessageRepository;
import com.message.chat.WITS.repository.ConversationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageService(MessageRepository messageRepository, ConversationRepository conversationRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Message sendPrivateMessage(String senderId, String recipientId, String content, String mediaUrl) {
        // Simple implementation for demo
        Message msg = new Message();
        msg.setId(UUID.randomUUID());
        msg.setSenderId(UUID.fromString(senderId));
        msg.setContent(content);
        msg.setMediaUrl(mediaUrl);
        msg.setMessageType(Message.MessageType.TEXT);
        msg.setCreatedAt(Instant.now());
        return messageRepository.save(msg);
    }

    public List<Message> getPrivateMessages(String userId1, String userId2) {
        // Need to update to actually fetch by sender/receiver logic, for now returning all for conversation id
        return List.of();
    }

    @Transactional
    public Message sendGroupMessage(String senderId, String groupId, String content, String mediaUrl) {
        Message msg = new Message();
        msg.setId(UUID.randomUUID());
        msg.setSenderId(UUID.fromString(senderId));
        msg.setChannelId(groupId);
        msg.setContent(content);
        msg.setMediaUrl(mediaUrl);
        msg.setMessageType(Message.MessageType.TEXT);
        msg.setCreatedAt(Instant.now());
        return messageRepository.save(msg);
    }

    public List<Message> getGroupMessages(String groupId) {
        return messageRepository.findByChannelIdOrderByCreatedAtAsc(groupId);
    }

    @Transactional
    public void deleteMessage(UUID messageId, String userId) {
        messageRepository.deleteById(messageId);
    }

    @Transactional
    public void updateMessage(UUID messageId, String userId, String newContent) {
        messageRepository.findById(messageId).ifPresent(m -> {
            m.setContent(newContent);
            messageRepository.save(m);
        });
    }

    @Transactional
    public Message sendMessage(UUID conversationId, UUID senderId, String content, Message.MessageType type, boolean isSnap, Integer expirySeconds) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message message = new Message();
        message.setId(UUID.randomUUID());
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setContent(content);
        message.setMessageType(type != null ? type : Message.MessageType.TEXT);
        message.setCreatedAt(Instant.now());
        message.setTimestamp(java.time.LocalDateTime.now());
        message.setStatus(Message.MessageStatus.SENT);

        if (isSnap) {
            message.setSnap(true);
            if (expirySeconds != null && expirySeconds > 0) {
                message.setExpiryTime(java.time.LocalDateTime.now().plusSeconds(expirySeconds));
            } else {
                // Default to 10 seconds for snaps if not provided
                message.setExpiryTime(java.time.LocalDateTime.now().plusSeconds(10));
            }
        }

        Message savedMessage = messageRepository.save(message);

        messagingTemplate.convertAndSend(
                "/topic/conversation/" + conversationId,
                savedMessage);

        return savedMessage;
    }

    @Transactional
    public Message sendScheduledMessage(UUID conversationId, UUID senderId, String content, java.time.LocalDateTime scheduledAt) {
        Message message = new Message();
        message.setId(UUID.randomUUID());
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setContent(content);
        message.setMessageType(Message.MessageType.TEXT);
        message.setCreatedAt(Instant.now());
        message.setTimestamp(java.time.LocalDateTime.now());
        message.setStatus(Message.MessageStatus.SENT);
        message.setScheduledAt(scheduledAt);

        return messageRepository.save(message); // Don't broadcast yet
    }

    @Transactional
    public void markMessageAsRead(UUID messageId, String readerId) {
        messageRepository.findById(messageId).ifPresent(m -> {
            m.setStatus(Message.MessageStatus.READ);
            messageRepository.save(m);

            // Notify sender
            messagingTemplate.convertAndSend(
                    "/topic/messages/receipt/" + m.getId(),
                    m);
        });
    }

    @Transactional
    public void reportScreenshot(UUID messageId, String reporterId) {
        messageRepository.findById(messageId).ifPresent(m -> {
            m.setScreenshotDetected(true);
            messageRepository.save(m);

            // Notify sender that a screenshot was taken
            messagingTemplate.convertAndSend(
                    "/topic/messages/screenshot/" + m.getId(),
                    m);
        });
    }

    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 10000)
    @Transactional
    public void processScheduledMessages() {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        List<Message> scheduledMessages = messageRepository.findByStatusAndScheduledAtBefore(Message.MessageStatus.SENT, now);

        for (Message message : scheduledMessages) {
            message.setScheduledAt(null); // Clear scheduled at since it's now sent
            message.setTimestamp(now);
            messageRepository.save(message);

            messagingTemplate.convertAndSend(
                    "/topic/conversation/" + message.getConversationId(),
                    message);
        }
    }

    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 5000)
    @Transactional
    public void cleanupExpiredSnaps() {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        List<Message> expiredSnaps = messageRepository.findByIsSnapTrueAndExpiryTimeBefore(now);

        for (Message message : expiredSnaps) {
            // Either delete them completely or mark as DELETED
            message.setStatus(Message.MessageStatus.DELETED);
            message.setContent("Snap expired");
            message.setMediaUrl(null);
            messageRepository.save(message);

            // Notify clients to remove it from UI
            messagingTemplate.convertAndSend(
                    "/topic/messages/deleted/" + message.getId(),
                    message);
        }
    }

    public List<Message> getConversationMessages(UUID conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }
}
