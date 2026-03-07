package com.message.chat.WITS.service;

import com.message.chat.WITS.model.FriendRequest;
import com.message.chat.WITS.model.User;
import com.message.chat.WITS.repository.FriendRequestRepository;
import com.message.chat.WITS.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendRequestRepository requestRepository;
    private final UserRepository userRepository;

    public void sendFriendRequest(String senderId, String receiverId) {
        if (senderId.equals(receiverId))
            return;

        Optional<User> sender = userRepository.findById(senderId);
        Optional<User> receiver = userRepository.findById(receiverId);

        if (sender.isPresent() && receiver.isPresent()) {
            // Check if already friends
            if (sender.get().getFriendIds().contains(receiverId))
                return;

            // Check if request already exists
            List<FriendRequest> existing = requestRepository.findBySenderIdAndReceiverId(senderId, receiverId);
            if (!existing.isEmpty())
                return;

            FriendRequest request = new FriendRequest();
            request.setSenderId(senderId);
            request.setReceiverId(receiverId);
            request.setStatus(FriendRequest.RequestStatus.PENDING);
            request.setTimestamp(LocalDateTime.now());
            requestRepository.save(request);
        }
    }

    @Transactional
    public void acceptFriendRequest(String requestId) {
        Optional<FriendRequest> requestOpt = requestRepository.findById(requestId);
        if (requestOpt.isPresent() && requestOpt.get().getStatus() == FriendRequest.RequestStatus.PENDING) {
            FriendRequest request = requestOpt.get();
            request.setStatus(FriendRequest.RequestStatus.ACCEPTED);
            requestRepository.save(request);

            // Add to each other's friend lists
            addFriend(request.getSenderId(), request.getReceiverId());
            addFriend(request.getReceiverId(), request.getSenderId());
        }
    }

    public void rejectFriendRequest(String requestId) {
        requestRepository.findById(requestId).ifPresent(request -> {
            request.setStatus(FriendRequest.RequestStatus.REJECTED);
            requestRepository.save(request);
        });
    }

    private void addFriend(String userId, String friendId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.getFriendIds().add(friendId);
            userRepository.save(user);
        });
    }

    public List<FriendRequest> getPendingRequests(String userId) {
        return requestRepository.findByReceiverIdAndStatus(userId, FriendRequest.RequestStatus.PENDING);
    }
}
