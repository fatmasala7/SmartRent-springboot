package com.smartrent.property.kafka;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingEvent {
    private String eventId;
    private String eventType;
    private Integer relatedId;       // propertyID
    private Integer actorUserId;
    private Integer targetUserId;
    private String message;
    private LocalDateTime createdAt;
}
