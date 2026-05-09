package com.smartrent.auth.kafka;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEvent {
    private String eventId;
    private String eventType;
    private Integer relatedId;
    private Integer actorUserId;
    private Integer targetUserId;
    private String message;
    private LocalDateTime createdAt;

    public static UserEvent of(String type, Integer relatedId, Integer actorId, Integer targetId, String message) {
        return UserEvent.builder()
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
