package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Contact;
import com.message.chat.WITS.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> getUserContacts(UUID userId) {
        return contactRepository.findByUserIdAndStatus(userId, "ACCEPTED");
    }

    @Transactional
    public Contact addContact(UUID userId, UUID contactId) {
        Contact request = new Contact();
        request.setId(UUID.randomUUID());
        request.setUserId(userId);
        request.setContactId(contactId);
        request.setStatus("PENDING");
        request.setCreatedAt(Instant.now());

        return contactRepository.save(request);
    }
}
