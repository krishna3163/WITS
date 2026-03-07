package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "split_bills")
public class SplitBill {
    @Id
    private String id;

    private String creatorId; // User who created the split
    private String groupId; // Optional group where the bill is shared
    private String description;

    private double totalAmount;
    private String currency;

    // Maps User ID to Amount they owe
    @Builder.Default
    private Map<String, Double> participants = new HashMap<>();

    // Maps User ID to boolean indicating if they have paid
    @Builder.Default
    private Map<String, Boolean> paymentStatus = new HashMap<>();

    private LocalDateTime createdAt;

    public boolean isFullyPaid() {
        return !paymentStatus.containsValue(false);
    }
}
