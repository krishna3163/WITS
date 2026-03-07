package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Friendship;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface FriendshipRepository extends MongoRepository<Friendship, String> {
    Optional<Friendship> findByUserId1AndUserId2(String userId1, String userId2);
    // Add logic to find by either permutation
}
