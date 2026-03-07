package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.TrendingTopic;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrendingTopicRepository extends MongoRepository<TrendingTopic, String> {
    Optional<TrendingTopic> findByHashtag(String hashtag);

    List<TrendingTopic> findTop10ByOrderByUsageCountDesc();
}
