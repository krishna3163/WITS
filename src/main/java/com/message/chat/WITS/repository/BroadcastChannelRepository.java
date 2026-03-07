package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.BroadcastChannel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BroadcastChannelRepository extends MongoRepository<BroadcastChannel, String> {
    List<BroadcastChannel> findByOwnerId(String ownerId);

    Optional<BroadcastChannel> findByInviteLink(String inviteLink);
}
