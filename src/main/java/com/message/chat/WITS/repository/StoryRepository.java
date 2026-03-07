package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Story;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository extends MongoRepository<Story, String> {
    List<Story> findByAuthorIdAndExpiryTimeAfter(String authorId, LocalDateTime time);

    List<Story> findByExpiryTimeBefore(LocalDateTime time);
}
