package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Conversation;
import com.message.chat.WITS.model.ConversationParticipant;
import com.message.chat.WITS.repository.ConversationRepository;
import com.message.chat.WITS.repository.ConversationParticipantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;

    public ConversationService(ConversationRepository conversationRepository,
            ConversationParticipantRepository participantRepository) {
        this.conversationRepository = conversationRepository;
        this.participantRepository = participantRepository;
    }

    @Transactional
    public Conversation createConversation(List<UUID> userIds) {
        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setIsGroup(userIds.size() > 2);
        conversation.setCreatedAt(Instant.now());

        conversationRepository.save(conversation);

        for (UUID userId : userIds) {
            ConversationParticipant p = new ConversationParticipant();
            p.setId(UUID.randomUUID());
            p.setConversationId(conversation.getId());
            p.setUserId(userId);
            p.setRole("MEMBER");
            p.setJoinedAt(Instant.now());

            participantRepository.save(p);
        }

        return conversation;
    }

    public List<Conversation> getUserConversations(UUID userId) {
        List<UUID> convIds = participantRepository.findByUserId(userId).stream()
                .map(ConversationParticipant::getConversationId)
                .toList();
        return conversationRepository.findAllById(convIds);
    }
}
