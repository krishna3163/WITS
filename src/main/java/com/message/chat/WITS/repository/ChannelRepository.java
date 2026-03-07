package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Channel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChannelRepository extends MongoRepository<Channel, String> {
    List<Channel> findByServerIdOrderByPositionAsc(String serverId);
}
