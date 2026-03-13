package com.message.chat.WITS.service;

import com.message.chat.WITS.model.CloseFriend;
import com.message.chat.WITS.repository.CloseFriendRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class CloseFriendService {

    private final CloseFriendRepository closeFriendRepository;

    public CloseFriendService(CloseFriendRepository closeFriendRepository) {
        this.closeFriendRepository = closeFriendRepository;
    }

    public Optional<CloseFriend> getCloseFriend(UUID id) {
        return closeFriendRepository.findById(id);
    }

    public CloseFriend updateCloseFriend(CloseFriend closeFriend) {
        return closeFriendRepository.save(closeFriend);
    }
}
