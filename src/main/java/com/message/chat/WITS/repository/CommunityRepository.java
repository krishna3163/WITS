package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Community;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    List<Community> findTop10ByOrderBySubscriberCountDesc(); // For recommended communities

    List<Community> findByNameContainingIgnoreCase(String name);
}
