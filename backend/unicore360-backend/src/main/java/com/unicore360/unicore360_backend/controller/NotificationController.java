package com.unicore360.unicore360_backend.controller;

import com.unicore360.unicore360_backend.model.Notification;
import com.unicore360.unicore360_backend.model.NotificationType;
import com.unicore360.unicore360_backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping("/test")
    public String testEndpoint() {
        return "Notification controller is working!";
    }

    @GetMapping
    public List<Notification> getUserNotifications(@RequestParam Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/unread-count")
    public Long getUnreadCount(@RequestParam Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @PostMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @DeleteMapping("/old")
    public void deleteOldNotifications() {
        // Implementation
    }

    // UPDATED: Now accepts BOTH GET and POST requests
    @RequestMapping(value = "/create-test", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<Notification> createTestNotification(@RequestParam Long userId) {
        try {
            System.out.println("Creating notification for user: " + userId);

            Notification notification = new Notification();
            notification.setUserId(userId);
            notification.setTitle("Test Notification");
            notification.setMessage("This is a test notification");
            notification.setType(NotificationType.SYSTEM);
            notification.setRead(false);

            Notification saved = notificationRepository.save(notification);
            System.out.println("Saved with ID: " + saved.getId());

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/security-test")
    public String securityTest() {
        return "Security is working!";
    }
}