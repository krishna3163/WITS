package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.BlocklistEntry;
import com.message.chat.WITS.service.BlocklistEntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/blocklist")
public class BlocklistEntryController {

    private final BlocklistEntryService blocklistEntryService;

    public BlocklistEntryController(BlocklistEntryService blocklistEntryService) {
        this.blocklistEntryService = blocklistEntryService;
    }

    @GetMapping("/{blockId}")
    public ResponseEntity<BlocklistEntry> getBlocklistEntry(@PathVariable UUID blockId) {
        Optional<BlocklistEntry> blocklistEntryOptional = blocklistEntryService.getBlocklistEntry(blockId);
        return blocklistEntryOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{blockId}")
    public ResponseEntity<BlocklistEntry> updateBlocklistEntry(@PathVariable UUID blockId, @RequestBody BlocklistEntry blocklistEntry) {
        blocklistEntry.setBlock_id(blockId);
        BlocklistEntry updatedBlocklistEntry = blocklistEntryService.updateBlocklistEntry(blocklistEntry);
        return ResponseEntity.ok(updatedBlocklistEntry);
    }
}
