package com.smartrent.engagement.kafka;

import com.smartrent.engagement.entity.Notification;
import com.smartrent.engagement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EventConsumer {

    private final NotificationRepository notificationRepo;

    @KafkaListener(topics = {"user-events", "property-events", "booking-events"},
                   groupId = "engagement-service-group")
    public void handleEvent(SmartRentEvent event) {
        if (event == null || event.getEventType() == null) return;
        log.info("Received event: {}", event.getEventType());

        Integer userId = resolveTargetUser(event);
        if (userId == null) {
            log.warn("No target user for event {}, skipping notification", event.getEventType());
            return;
        }

        String title;
        String type = event.getEventType();
        String message = event.getMessage() != null ? event.getMessage() : "";

        title = switch (type) {
            case "UserRegistered"             -> "Welcome to SmartRent!";
            case "LandlordApproved"           -> "Account Approved";
            case "LandlordRejected"           -> "Account Rejected";
            case "PropertySubmitted"          -> "Property Submitted for Review";
            case "PropertyApproved"           -> "Property Approved";
            case "PropertyRejected"           -> "Property Rejected";
            case "VisitRequestCreated"        -> "New Visit Request";
            case "VisitRequestAccepted"       -> "Visit Request Accepted";
            case "VisitRequestRejected"       -> "Visit Request Rejected";
            case "RentalApplicationSubmitted" -> "New Rental Application";
            case "ApplicationAccepted"        -> "Application Accepted!";
            case "ApplicationRejected"        -> "Application Rejected";
            case "RentalCreated"              -> "Rental Created";
            default                           -> "SmartRent Notification";
        };

        Notification notification = Notification.builder()
            .userID(userId)
            .relatedID(event.getRelatedId())
            .type(type)
            .title(title)
            .message(message)
            .isRead(false)
            .build();

        notificationRepo.save(notification);
        log.info("Notification saved for user {}: {}", userId, title);
    }

    private Integer resolveTargetUser(SmartRentEvent event) {
        // targetUserId is set for direct notifications
        if (event.getTargetUserId() != null) return event.getTargetUserId();
        // actorUserId as fallback for self-notifications (e.g., UserRegistered)
        if ("UserRegistered".equals(event.getEventType())) return event.getActorUserId();
        return null;
    }
}
