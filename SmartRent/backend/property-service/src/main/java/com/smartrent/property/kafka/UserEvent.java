package com.smartrent.property.kafka;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEvent {
    private String eventId;
    private String eventType;
    private Integer relatedId;       // userId
    private Integer actorUserId;
    private Integer targetUserId;
    private String message;
    private LocalDateTime createdAt;
}
