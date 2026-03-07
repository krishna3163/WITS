package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Notification;
import com.message.chat.WITS.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @PostMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send")
    public ResponseEntity<Notification> createPushNotification(
            @RequestParam UUID userId,
            @RequestParam String type,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) UUID referenceId) {

        Notification.NotificationType enumType = Notification.NotificationType.valueOf(type.toUpperCase());
        return ResponseEntity.ok(
                notificationService.sendNotification(userId, enumType, title, content, referenceId));
    }
}
