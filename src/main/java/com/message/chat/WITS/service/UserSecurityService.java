package com.message.chat.WITS.service;

import com.message.chat.WITS.model.UserSecurity;
import com.message.chat.WITS.repository.UserSecurityRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserSecurityService {

    private final UserSecurityRepository userSecurityRepository;

    public UserSecurityService(UserSecurityRepository userSecurityRepository) {
        this.userSecurityRepository = userSecurityRepository;
    }

    public Optional<UserSecurity> getUserSecurity(UUID id) {
        return userSecurityRepository.findById(id);
    }

    public UserSecurity updateUserSecurity(UserSecurity userSecurity) {
        return userSecurityRepository.save(userSecurity);
    }
}
