package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Poll;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PollRepository extends MongoRepository<Poll, String> {
    List<Poll> findByGroupId(String groupId);
}
