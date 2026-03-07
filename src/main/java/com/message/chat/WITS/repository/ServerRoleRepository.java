package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.ServerRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ServerRoleRepository extends MongoRepository<ServerRole, String> {
    List<ServerRole> findByServerIdOrderByPositionAsc(String serverId);
}
