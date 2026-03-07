package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Notification;
import com.message.chat.WITS.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Notification sendNotification(UUID userId, Notification.NotificationType type, String title, String content, UUID referenceId) {

        Notification notif = new Notification();
        notif.setId(UUID.randomUUID());
        notif.setUserId(userId);
        notif.setType(type);
        notif.setTitle(title);
        notif.setContent(content);
        notif.setReferenceId(referenceId);
        notif.setIsRead(false);
        notif.setCreatedAt(Instant.now());

        Notification saved = notificationRepository.save(notif);

        // 1. WebSocket Live Push (Alerts active users currently browsing)
        messagingTemplate.convertAndSend("/topic/user/" + userId + "/notifications", saved);

        // 2. Future expansion: Apple APNS / Firebase FCM push notification call logic
        // can be triggered here for offline devices!

        return saved;
    }

    public List<Notification> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public void markAllRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalse(UUID.fromString(userId));
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }
}
