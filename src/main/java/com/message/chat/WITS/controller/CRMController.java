package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Company;
import com.message.chat.WITS.model.Deal;
import com.message.chat.WITS.service.CRMService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/crm")
@RequiredArgsConstructor
public class CRMController {
    private final CRMService crmService;

    @GetMapping("/companies")
    public List<Company> getAllCompanies() {
        return crmService.getAllCompanies();
    }

    @PostMapping("/companies")
    public Company addCompany(@RequestBody Company company) {
        return crmService.addCompany(company);
    }

    @GetMapping("/deals")
    public List<Deal> getAllDeals() {
        return crmService.getAllDeals();
    }

    @PostMapping("/deals")
    public Deal addDeal(@RequestBody Deal deal) {
        return crmService.addDeal(deal);
    }

    @PatchMapping("/deals/{id}/stage")
    public Deal updateDealStage(@PathVariable UUID id, @RequestBody String stage) {
        return crmService.updateDealStage(id, stage);
    }
}
