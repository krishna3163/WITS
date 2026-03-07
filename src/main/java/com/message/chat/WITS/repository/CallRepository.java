package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Call;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CallRepository extends MongoRepository<Call, String> {
    List<Call> findByInitiatorId(String initiatorId);

    List<Call> findByParticipantIdsContaining(String userId);
}
