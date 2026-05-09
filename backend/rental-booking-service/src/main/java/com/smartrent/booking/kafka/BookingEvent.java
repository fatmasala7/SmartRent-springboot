package com.smartrent.booking.kafka;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BookingEvent {
    private String eventId;
    private String eventType;
    private Integer relatedId;      // propertyID for property-service to update
    private Integer actorUserId;
    private Integer targetUserId;
    private String message;
    private LocalDateTime createdAt;

    public static BookingEvent of(String type, Integer relatedId, Integer actorId,
                                  Integer targetId, String message) {
        return BookingEvent.builder()
            .eventId(UUID.randomUUID().toString())
            .eventType(type).relatedId(relatedId)
            .actorUserId(actorId).targetUserId(targetId)
            .message(message).createdAt(LocalDateTime.now()).build();
    }
}
