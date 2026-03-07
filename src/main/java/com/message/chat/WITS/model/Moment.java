package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "moments")
public class Moment {
    @Id
    private String id;
    private String authorId; // User who posted the moment
    private String caption;

    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    private String videoUrl;

    @Builder.Default
    private Set<String> likedBy = new HashSet<>();

    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    private LocalDateTime timestamp;
    private String location;

    // Privacy setting, e.g. who can view (followers only vs public)
    @Builder.Default
    private boolean isPublic = false;
}
