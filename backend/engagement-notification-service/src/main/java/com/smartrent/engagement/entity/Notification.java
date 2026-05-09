package com.smartrent.engagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Notifications")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NotificationID") private Integer notificationID;

    @Column(name = "UserID",    nullable = false) private Integer userID;
    @Column(name = "RelatedID")                   private Integer relatedID;
    @Column(name = "Type",      length = 100)     private String type;
    @Column(name = "Title",     length = 300)     private String title;
    @Column(name = "Message",   columnDefinition = "TEXT") private String message;
    @Column(name = "IsRead",    nullable = false) private Boolean isRead = false;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist public void prePersist() { createdAt = LocalDateTime.now(); }
}
