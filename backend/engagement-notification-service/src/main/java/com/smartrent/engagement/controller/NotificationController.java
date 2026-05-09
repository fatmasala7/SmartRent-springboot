package com.smartrent.engagement.controller;

import com.smartrent.engagement.dto.EngagementDtos.*;
import com.smartrent.engagement.service.EngagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final EngagementService engagementService;

    @GetMapping("/my")
    public ResponseEntity<List<NotificationDto>> getMyNotifications(Authentication auth) {
        return ResponseEntity.ok(engagementService.getMyNotifications((Integer) auth.getPrincipal()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markRead(Authentication auth, @PathVariable Integer id) {
        return ResponseEntity.ok(engagementService.markRead((Integer) auth.getPrincipal(), id));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse> markAllRead(Authentication auth) {
        return ResponseEntity.ok(engagementService.markAllRead((Integer) auth.getPrincipal()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(Authentication auth, @PathVariable Integer id) {
        return ResponseEntity.ok(engagementService.deleteNotification((Integer) auth.getPrincipal(), id));
    }
}
