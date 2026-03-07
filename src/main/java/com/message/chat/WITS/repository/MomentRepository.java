package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Moment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MomentRepository extends MongoRepository<Moment, String> {
    List<Moment> findByAuthorIdInOrderByTimestampDesc(List<String> authorIds);
}
