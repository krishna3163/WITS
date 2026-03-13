package com.message.chat.WITS.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl; // Stored in InsForge Storage

    @Builder.Default
    private Integer stock = 0;
}
