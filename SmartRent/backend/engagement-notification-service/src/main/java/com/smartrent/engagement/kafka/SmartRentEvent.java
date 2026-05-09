package com.smartrent.engagement.kafka;

import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SmartRentEvent {
    private String eventId;
    private String eventType;
    private Integer relatedId;
    private Integer actorUserId;
    private Integer targetUserId;
    private String message;
    private LocalDateTime createdAt;
}
