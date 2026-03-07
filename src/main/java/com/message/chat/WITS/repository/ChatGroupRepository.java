package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.ChatGroup;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatGroupRepository extends MongoRepository<ChatGroup, String> {
    // Custom query to find groups where a user is a member could be done via
    // MongoTemplate or @Query
    // For simplicity, we'll fetch all and filter in service, or use @Query
}
