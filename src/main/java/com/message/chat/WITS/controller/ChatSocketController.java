package com.message.chat.WITS.controller;

import com.message.chat.WITS.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import java.util.UUID;

class ChatMessageRequest {
    private UUID conversationId;
    private UUID senderId;
    private String content;
    private com.message.chat.WITS.model.Message.MessageType messageType;
    private boolean isSnap;
    private Integer expirySeconds;

    public UUID getConversationId() {
        return conversationId;
    }

    public void setConversationId(UUID conversationId) {
        this.conversationId = conversationId;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public com.message.chat.WITS.model.Message.MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(com.message.chat.WITS.model.Message.MessageType messageType) {
        this.messageType = messageType;
    }

    public boolean isSnap() {
        return isSnap;
    }

    public void setSnap(boolean snap) {
        isSnap = snap;
    }

    public Integer getExpirySeconds() {
        return expirySeconds;
    }

    public void setExpirySeconds(Integer expirySeconds) {
        this.expirySeconds = expirySeconds;
    }
}

@Controller
public class ChatSocketController {

    private final MessageService messageService;

    public ChatSocketController(MessageService messageService) {
        this.messageService = messageService;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageRequest request) {
        messageService.sendMessage(
                request.getConversationId(),
                request.getSenderId(),
                request.getContent(),
                request.getMessageType(),
                request.isSnap(),
                request.getExpirySeconds());
    }
}
