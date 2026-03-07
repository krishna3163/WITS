package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.OfficialAccount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfficialAccountRepository extends MongoRepository<OfficialAccount, String> {
    List<OfficialAccount> findByOwnerUserId(String ownerUserId);

    List<OfficialAccount> findByCategory(String category);
}
