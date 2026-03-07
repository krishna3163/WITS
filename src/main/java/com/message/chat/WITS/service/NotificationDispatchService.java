package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Notification;
import com.message.chat.WITS.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationDispatchService {

    private final NotificationRepository notificationRepository;

    // In a real application, these would map to Firebase Cloud Messaging (FCM) or
    // Apple Push Notification service (APNs)
    // and Amazon SES (Simple Email Service) or SendGrid.

    public Notification sendInAppNotification(String recipientId, String content, Notification.NotificationType type,
            String targetId) {
        Notification notification = Notification.builder()
                .userId(java.util.UUID.fromString(recipientId))
                .content(content)
                .type(type)
                .referenceId(java.util.UUID.fromString(targetId))
                .createdAt(java.time.Instant.now())
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    public void dispatchPushNotification(String deviceToken, String title, String body) {
        // Mocking Push Notification dispatch
        log.info("DISPATCHING PUSH to Token: {} | Title: {} | Body: {}", deviceToken, title, body);
        // e.g. fcmService.sendPush(deviceToken, title, body);
    }

    public void dispatchEmailAlert(String emailAddress, String subject, String body) {
        // Mocking Email dispatch
        log.info("DISPATCHING EMAIL to: {} | Subject: {} | Body: {}", emailAddress, subject, body);
        // e.g. emailSender.send(emailAddress, subject, body);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(java.util.UUID.fromString(userId));
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(java.util.UUID.fromString(notificationId)).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }
}
