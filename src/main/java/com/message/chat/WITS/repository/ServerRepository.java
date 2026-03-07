package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Server;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ServerRepository extends MongoRepository<Server, String> {
    List<Server> findByMemberIdsContaining(String userId);
}
