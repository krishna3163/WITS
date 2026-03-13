package com.message.chat.WITS.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import java.time.Instant;

@Entity
@Table(name = "companies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private String industry;
    private String website;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
