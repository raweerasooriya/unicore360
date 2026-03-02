package com.unicore360.unicore360_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String title;

    private String message;

    private Long referenceId;

    private boolean isRead;

    private LocalDateTime createdAt;

    // ADD THIS METHOD - it sets createdAt automatically
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}