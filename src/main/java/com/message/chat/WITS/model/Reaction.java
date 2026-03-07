package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reaction {
    private String emoji; // e.g., "👍", "❤️"
    @Builder.Default
    private Set<String> userIds = new HashSet<>();
}
