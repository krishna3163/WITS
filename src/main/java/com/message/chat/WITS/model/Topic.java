package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {
    private String id;
    private String name;
    private String description;
    private String iconEmoji;
    private String pinnedMessageId;
}
