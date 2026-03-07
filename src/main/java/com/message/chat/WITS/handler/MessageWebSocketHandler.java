package com.message.chat.WITS.handler;

import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageWebSocketHandler {

    private final MessageService messageService;

    public void handleIncomingMessage(String senderId, String recipientId, String content, boolean isGroup) {
        Message msg;
        if (isGroup) {
            msg = messageService.sendGroupMessage(senderId, recipientId, content, null);
        } else {
            msg = messageService.sendPrivateMessage(senderId, recipientId, content, null);
        }

        // Logic to broadcast the message to the recipient(s) would go here
        broadcastToUser(recipientId, msg);
    }

    public void handleReaction(String messageId, String userId, String emoji) {
        // Reaction system to be built
        // Message msg = messageService.addReaction(messageId, userId, emoji);
        // Broadcast the new reaction to all chat participants
        // broadcastToChatParticipants(msg);
    }

    private void broadcastToUser(String userId, Object payload) {
        // Implementation for sending via SimpMessagingTemplate or similar
        System.out.println("Broadcasting to " + userId + ": " + payload);
    }

    private void broadcastToChatParticipants(Message msg) {
        // Implementation for broadcasting to a topic or all participants
        System.out.println("Broadcasting reaction update for message " + msg.getId());
    }
}
