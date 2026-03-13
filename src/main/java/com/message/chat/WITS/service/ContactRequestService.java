package com.message.chat.WITS.service;

import com.message.chat.WITS.model.ContactRequest;
import com.message.chat.WITS.repository.ContactRequestRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ContactRequestService {

    private final ContactRequestRepository contactRequestRepository;

    public ContactRequestService(ContactRequestRepository contactRequestRepository) {
        this.contactRequestRepository = contactRequestRepository;
    }

    public Optional<ContactRequest> getContactRequest(UUID id) {
        return contactRequestRepository.findById(id);
    }

    public ContactRequest updateContactRequest(ContactRequest contactRequest) {
        return contactRequestRepository.save(contactRequest);
    }
}
