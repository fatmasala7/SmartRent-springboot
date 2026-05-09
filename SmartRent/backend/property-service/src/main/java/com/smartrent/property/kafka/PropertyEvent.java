package com.smartrent.property.kafka;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyEvent {
    private String eventId;
    private String eventType;
    private Integer relatedId;
    private Integer actorUserId;
    private Integer targetUserId;
    private String message;
    private LocalDateTime createdAt;

    public static PropertyEvent of(String type, Integer relatedId, Integer actorId,
                                   Integer targetId, String message) {
        return PropertyEvent.builder()
            .eventId(UUID.randomUUID().toString())
            .eventType(type)
            .relatedId(relatedId)
            .actorUserId(actorId)
            .targetUserId(targetId)
            .message(message)
            .createdAt(LocalDateTime.now())
            .build();
    }
}
