package com.message.chat.WITS.service;

import com.message.chat.WITS.model.BlocklistEntry;
import com.message.chat.WITS.repository.BlocklistEntryRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class BlocklistEntryService {

    private final BlocklistEntryRepository blocklistEntryRepository;

    public BlocklistEntryService(BlocklistEntryRepository blocklistEntryRepository) {
        this.blocklistEntryRepository = blocklistEntryRepository;
    }

    public Optional<BlocklistEntry> getBlocklistEntry(UUID id) {
        return blocklistEntryRepository.findById(id);
    }

    public BlocklistEntry updateBlocklistEntry(BlocklistEntry blocklistEntry) {
        return blocklistEntryRepository.save(blocklistEntry);
    }
}
