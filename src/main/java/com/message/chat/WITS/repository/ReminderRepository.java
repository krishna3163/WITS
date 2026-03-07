package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.Reminder;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReminderRepository extends MongoRepository<Reminder, String> {
    List<Reminder> findByGroupId(String groupId);
}
