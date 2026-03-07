package com.message.chat.WITS.service;

import com.message.chat.WITS.model.OfficialAccount;
import com.message.chat.WITS.repository.OfficialAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BusinessService {

    private final OfficialAccountRepository businessRepository;

    public OfficialAccount registerBusinessAccount(String name, String description, String category,
            String ownerUserId) {
        OfficialAccount account = OfficialAccount.builder()
                .name(name)
                .description(description)
                .category(category)
                .ownerUserId(ownerUserId)
                .verificationBadgeType("NONE")
                .createdAt(LocalDateTime.now())
                .build();

        account.getOperatorIds().add(ownerUserId); // Owner is default operator
        return businessRepository.save(account);
    }

    public void setAutoReply(String accountId, String keyword, String reply) {
        businessRepository.findById(accountId).ifPresent(acc -> {
            acc.getAutoReplies().put(keyword.toLowerCase(), reply);
            businessRepository.save(acc);
        });
    }

    public void linkMiniApp(String accountId, String miniAppId) {
        businessRepository.findById(accountId).ifPresent(acc -> {
            acc.getLinkedMiniAppIds().add(miniAppId);
            businessRepository.save(acc);
        });
    }

    public Optional<OfficialAccount> getBusinessProfile(String accountId) {
        return businessRepository.findById(accountId);
    }
}
