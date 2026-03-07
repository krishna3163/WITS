package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "servers")
public class Server {
    @Id
    private String id;
    private String name;
    private String description;
    private String iconUrl;
    private String ownerId;

    @Builder.Default
    private List<String> memberIds = new ArrayList<>();

    // userId -> List of roleIds
    @Builder.Default
    private Map<String, List<String>> userRoles = new HashMap<>();
}
