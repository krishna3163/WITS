package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.NotePage;
import com.message.chat.WITS.service.NotePageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NotePageController {
    private final NotePageService notePageService;

    @GetMapping("/my")
    public List<NotePage> getMyPages(@RequestParam UUID ownerId) {
        return notePageService.getMyPages(ownerId);
    }

    @GetMapping("/public")
    public List<NotePage> getPublicPages() {
        return notePageService.getPublicPages();
    }

    @PostMapping
    public NotePage addPage(@RequestBody NotePage page) {
        return notePageService.addPage(page);
    }

    @GetMapping("/search")
    public List<NotePage> searchPages(@RequestParam String query) {
        return notePageService.searchPages(query);
    }

    @PutMapping("/{id}")
    public NotePage updatePage(@PathVariable UUID id, @RequestBody NotePage page) {
        return notePageService.updatePage(id, page);
    }

    @DeleteMapping("/{id}")
    public void deletePage(@PathVariable UUID id) {
        notePageService.deletePage(id);
    }
}
