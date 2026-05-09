package com.smartrent.engagement.repository;

import com.smartrent.engagement.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserIDOrderByCreatedAtDesc(Integer userId);
}
