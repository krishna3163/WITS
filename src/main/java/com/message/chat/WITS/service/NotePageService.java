package com.message.chat.WITS.service;

import com.message.chat.WITS.model.NotePage;
import com.message.chat.WITS.repository.NotePageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class NotePageService {
    private final NotePageRepository notePageRepository;

    public List<NotePage> getMyPages(UUID ownerId) {
        return notePageRepository.findByOwnerId(ownerId);
    }

    public List<NotePage> getPublicPages() {
        return notePageRepository.findByIsPublicTrue();
    }

    public NotePage addPage(NotePage page) {
        if (page.getId() == null) {
            page.setId(UUID.randomUUID());
        }
        page.setCreatedAt(Instant.now());
        page.setUpdatedAt(Instant.now());
        return notePageRepository.save(page);
    }

    public NotePage updatePage(UUID id, NotePage details) {
        NotePage page = notePageRepository.findById(id).orElseThrow();
        page.setTitle(details.getTitle());
        page.setContent(details.getContent());
        page.setPublic(details.isPublic());
        page.setUpdatedAt(Instant.now());
        return notePageRepository.save(page);
    }

    public List<NotePage> searchPages(String query) {
        return notePageRepository.findByTitleContainingIgnoreCase(query);
    }

    public void deletePage(UUID id) {
        notePageRepository.deleteById(id);
    }
}
