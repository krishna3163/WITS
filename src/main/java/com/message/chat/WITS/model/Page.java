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
@Document(collection = "pages")
public class Page {
    @Id
    private String id;
    private String name;
    private String description;
    private String category;
    private String ownerId;
    private String profilePictureUrl;
    private String coverPhotoUrl;

    @Builder.Default
    private List<String> followerIds = new ArrayList<>();

    @Builder.Default
    private List<String> adminIds = new ArrayList<>();

    private boolean isVerified;
}
