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
    public Message sendMessage(UUID conversationId, UUID senderId, String content) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message message = new Message();
        message.setId(UUID.randomUUID());
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setContent(content);
        message.setMessageType(Message.MessageType.TEXT);
        message.setCreatedAt(Instant.now());

        Message savedMessage = messageRepository.save(message);

        messagingTemplate.convertAndSend(
                "/topic/conversation/" + conversationId,
                savedMessage);

        return savedMessage;
    }

    public List<Message> getConversationMessages(UUID conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }
}
