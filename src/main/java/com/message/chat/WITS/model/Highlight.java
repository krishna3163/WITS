package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "highlights")
public class Highlight {
    @Id
    private String id;
    private String userId;
    private String title;
    private String coverImageUrl;

    @Builder.Default
    private List<String> storyIds = new ArrayList<>();
}
