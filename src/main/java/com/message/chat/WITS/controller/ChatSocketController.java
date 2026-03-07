package com.message.chat.WITS.controller;

import com.message.chat.WITS.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import java.util.UUID;

class ChatMessageRequest {
    private UUID conversationId;
    private UUID senderId;
    private String content;

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
                request.getContent());
    }
}
