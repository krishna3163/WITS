package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByGroupId(String groupId);
}
