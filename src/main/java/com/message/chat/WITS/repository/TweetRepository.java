package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Tweet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TweetRepository extends MongoRepository<Tweet, String> {
    List<Tweet> findByAuthorId(String authorId);

    List<Tweet> findByHashtagNamesContaining(String hashtag);
}
