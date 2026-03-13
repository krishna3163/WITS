package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.NotePage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface NotePageRepository extends JpaRepository<NotePage, UUID> {
    List<NotePage> findByOwnerId(UUID ownerId);

    List<NotePage> findByIsPublicTrue();

    List<NotePage> findByTitleContainingIgnoreCase(String query);
}
