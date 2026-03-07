package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.GroupActionRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GroupActionRequestRepository extends MongoRepository<GroupActionRequest, String> {
    List<GroupActionRequest> findByGroupIdAndStatus(String groupId, GroupActionRequest.RequestStatus status);
}
