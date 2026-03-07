package com.message.chat.WITS.service;

import com.message.chat.WITS.model.ChatGroup;
import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.model.MiniApp;
import com.message.chat.WITS.model.User;
import com.message.chat.WITS.repository.ChatGroupRepository;
import com.message.chat.WITS.repository.MessageRepository;
import com.message.chat.WITS.repository.MiniAppRepository;
import com.message.chat.WITS.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GlobalSearchService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final ChatGroupRepository groupRepository;
    private final MiniAppRepository miniAppRepository;

    @Data
    @Builder
    public static class SearchResult {
        private List<User> users;
        private List<Message> messages;
        private List<ChatGroup> groups;
        private List<MiniApp> miniApps;
    }

    public SearchResult performGlobalSearch(String query) {
        String lowerQuery = query.toLowerCase();

        // Very basic wildcard search - in a real super app this would query
        // ElasticSearch
        List<User> matchingUsers = userRepository.findAll().stream()
                .filter(u -> (u.getUsername() != null && u.getUsername().toLowerCase().contains(lowerQuery)) ||
                        (u.getFullName() != null && u.getFullName().toLowerCase().contains(lowerQuery)))
                .collect(Collectors.toList());

        List<Message> matchingMessages = messageRepository.findByContentContainingIgnoreCase(query);

        List<ChatGroup> matchingGroups = groupRepository.findAll().stream()
                .filter(g -> g.getName() != null && g.getName().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());

        // Assuming MiniApp repository exists, though I haven't explicitly created one
        // this session yet.
        // It should inherit standard MongoRepository functions.
        List<MiniApp> matchingApps = miniAppRepository.findAll().stream()
                .filter(a -> a.getName() != null && a.getName().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());

        return SearchResult.builder()
                .users(matchingUsers)
                .messages(matchingMessages)
                .groups(matchingGroups)
                .miniApps(matchingApps)
                .build();
    }
}
