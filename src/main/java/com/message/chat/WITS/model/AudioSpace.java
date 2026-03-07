package com.message.chat.WITS.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "audio_spaces")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioSpace {
    @Id
    private UUID id;

    @Column(nullable = false)
    private UUID hostId;

    @Column(nullable = false)
    private String title;

    private String description;

    @ElementCollection
    @CollectionTable(name = "audio_space_speakers", joinColumns = @JoinColumn(name = "audio_space_id"))
    @Column(name = "user_id")
    @Builder.Default
    private Set<UUID> speakerIds = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "audio_space_listeners", joinColumns = @JoinColumn(name = "audio_space_id"))
    @Column(name = "user_id")
    @Builder.Default
    private Set<UUID> listenerIds = new HashSet<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean isLive = true;

    private Instant startedAt;
    private Instant endedAt;

    private String channelId;
}
