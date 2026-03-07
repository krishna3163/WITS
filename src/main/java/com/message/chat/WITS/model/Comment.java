package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
    private String id;
    private String authorId;
    private String content;
    private LocalDateTime timestamp;

    @Builder.Default
    private java.util.Set<String> upvoterIds = new java.util.HashSet<>();
    @Builder.Default
    private java.util.Set<String> downvoterIds = new java.util.HashSet<>();
    @Builder.Default
    private java.util.List<Comment> replies = new java.util.ArrayList<>();
}
