package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.SplitBill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SplitBillRepository extends MongoRepository<SplitBill, String> {
    List<SplitBill> findByGroupIdOrderByCreatedAtDesc(String groupId);

    List<SplitBill> findByCreatorIdOrderByCreatedAtDesc(String creatorId);
}
