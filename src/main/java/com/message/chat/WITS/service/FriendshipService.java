package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Friendship;
import com.message.chat.WITS.repository.FriendshipRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;

    public FriendshipService(FriendshipRepository friendshipRepository) {
        this.friendshipRepository = friendshipRepository;
    }

    public Optional<Friendship> getFriendship(UUID id) {
        return friendshipRepository.findById(id);
    }

    public Friendship updateFriendship(Friendship friendship) {
        return friendshipRepository.save(friendship);
    }
}
