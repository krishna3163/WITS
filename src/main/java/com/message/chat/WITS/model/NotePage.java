package com.message.chat.WITS.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import java.time.Instant;

@Entity
@Table(name = "note_pages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotePage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content; // Substantial text/markdown

    private UUID ownerId;

    @Builder.Default
    private boolean isPublic = false;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
