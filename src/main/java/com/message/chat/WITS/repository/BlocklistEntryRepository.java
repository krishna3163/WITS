package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.BlocklistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BlocklistEntryRepository extends JpaRepository<BlocklistEntry, UUID> {
}
