package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.ContactRequest;
import com.message.chat.WITS.service.ContactRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/contacts/requests")
public class ContactRequestController {

    private final ContactRequestService contactRequestService;

    public ContactRequestController(ContactRequestService contactRequestService) {
        this.contactRequestService = contactRequestService;
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<ContactRequest> getContactRequest(@PathVariable UUID requestId) {
        Optional<ContactRequest> contactRequestOptional = contactRequestService.getContactRequest(requestId);
        return contactRequestOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{requestId}")
    public ResponseEntity<ContactRequest> updateContactRequest(@PathVariable UUID requestId, @RequestBody ContactRequest contactRequest) {
        contactRequest.setRequest_id(requestId);
        ContactRequest updatedContactRequest = contactRequestService.updateContactRequest(contactRequest);
        return ResponseEntity.ok(updatedContactRequest);
    }
}
