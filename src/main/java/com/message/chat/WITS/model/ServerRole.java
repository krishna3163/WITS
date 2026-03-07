package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "server_roles")
public class ServerRole {
    @Id
    private String id;
    private String serverId;
    private String name;
    private String color; // Hex color code
    private int position; // For hierarchy

    @Builder.Default
    private Set<Permission> permissions = new HashSet<>();
}
