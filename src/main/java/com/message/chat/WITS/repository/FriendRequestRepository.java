package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.FriendRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FriendRequestRepository extends MongoRepository<FriendRequest, String> {
    List<FriendRequest> findByReceiverIdAndStatus(String receiverId, FriendRequest.RequestStatus status);

    List<FriendRequest> findBySenderIdAndReceiverId(String senderId, String receiverId);
}
