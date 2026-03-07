package com.message.chat.WITS.service;

import com.message.chat.WITS.model.User;
import com.message.chat.WITS.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(String username, String email, String password, String fullName, LocalDate dob) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .dob(dob)
                .build();
        return userRepository.save(user);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserStatus(String userId, boolean isOnline) {
        return userRepository.findById(userId).map(user -> {
            user.setOnline(isOnline);
            if (!isOnline) {
                user.setLastSeenAt(java.time.LocalDateTime.now());
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateTypingStatus(String userId, boolean isTyping, String channelId) {
        return userRepository.findById(userId).map(user -> {
            user.setTyping(isTyping);
            user.setCurrentTypingInId(isTyping ? channelId : null);
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> findNearbyUsers(double latitude, double longitude, double radiusInKm) {
        // Haversine formula or simple distance check for demo purposes
        return userRepository.findAll().stream()
                .filter(u -> calculateDistance(latitude, longitude, u.getLatitude(), u.getLongitude()) <= radiusInKm)
                .toList();
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        } else {
            double theta = lon1 - lon2;
            double dist = Math.sin(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)) +
                    Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.cos(Math.toRadians(theta));
            dist = Math.acos(dist);
            dist = Math.toDegrees(dist);
            dist = dist * 60 * 1.1515 * 1.609344; // to kilometers
            return (dist);
        }
    }

    public void addFriendByPhone(String userId, String phoneNumber) {
        userRepository.findByPhoneNumber(phoneNumber).ifPresent(friend -> {
            addFriendBothWays(userId, friend.getId());
        });
    }

    public void addFriendByQrCode(String userId, String qrCode) {
        userRepository.findByContactQrCode(qrCode).ifPresent(friend -> {
            addFriendBothWays(userId, friend.getId());
        });
    }

    private void addFriendBothWays(String user1Id, String user2Id) {
        userRepository.findById(user1Id).ifPresent(u1 -> {
            userRepository.findById(user2Id).ifPresent(u2 -> {
                u1.getFriendIds().add(u2.getId());
                u2.getFriendIds().add(u1.getId());
                userRepository.save(u1);
                userRepository.save(u2);
            });
        });
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}
