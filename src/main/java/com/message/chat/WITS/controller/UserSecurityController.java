package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.UserSecurity;
import com.message.chat.WITS.service.UserSecurityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users/security")
public class UserSecurityController {

    private final UserSecurityService userSecurityService;

    public UserSecurityController(UserSecurityService userSecurityService) {
        this.userSecurityService = userSecurityService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserSecurity> getUserSecurity(@PathVariable UUID userId) {
        Optional<UserSecurity> userSecurityOptional = userSecurityService.getUserSecurity(userId);
        return userSecurityOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserSecurity> updateUserSecurity(@PathVariable UUID userId, @RequestBody UserSecurity userSecurity) {
        userSecurity.setUser_id(userId);
        UserSecurity updatedUserSecurity = userSecurityService.updateUserSecurity(userSecurity);
        return ResponseEntity.ok(updatedUserSecurity);
    }
}
