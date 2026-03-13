package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Company;
import com.message.chat.WITS.model.Deal;
import com.message.chat.WITS.repository.CompanyRepository;
import com.message.chat.WITS.repository.DealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class CRMService {
    private final CompanyRepository companyRepository;
    private final DealRepository dealRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company addCompany(Company company) {
        if (company.getId() == null) {
            company.setId(UUID.randomUUID());
        }
        return companyRepository.save(company);
    }

    public List<Deal> getAllDeals() {
        return dealRepository.findAll();
    }

    public Deal addDeal(Deal deal) {
        if (deal.getId() == null) {
            deal.setId(UUID.randomUUID());
        }
        deal.setLastUpdated(Instant.now());
        return dealRepository.save(deal);
    }

    public Deal updateDealStage(UUID id, String stage) {
        Deal deal = dealRepository.findById(id).orElseThrow();
        deal.setStage(stage);
        deal.setLastUpdated(Instant.now());
        return dealRepository.save(deal);
    }
}
