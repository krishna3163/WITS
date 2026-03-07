package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.AudioSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AudioSpaceRepository extends JpaRepository<AudioSpace, UUID> {
    List<AudioSpace> findByIsLiveTrue();

    List<AudioSpace> findByHostId(UUID hostId);
}
