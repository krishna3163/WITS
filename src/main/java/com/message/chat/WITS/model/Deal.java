package com.message.chat.WITS.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "deals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Deal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String title;
    private BigDecimal value;
    private String stage; // PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST

    private UUID companyId;
    private UUID contactId;

    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant lastUpdated;
}
