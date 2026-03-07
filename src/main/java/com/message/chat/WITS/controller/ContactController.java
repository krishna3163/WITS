package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Contact;
import com.message.chat.WITS.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/add")
    public ResponseEntity<Contact> addContact(
            @RequestParam UUID userId,
            @RequestParam UUID contactId) {
        return ResponseEntity.ok(contactService.addContact(userId, contactId));
    }
}
