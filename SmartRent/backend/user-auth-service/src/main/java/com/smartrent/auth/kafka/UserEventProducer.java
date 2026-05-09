package com.smartrent.auth.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserEventProducer {

    private final KafkaTemplate<String, UserEvent> kafkaTemplate;

    public void publish(String topic, UserEvent event) {
        kafkaTemplate.send(topic, event.getEventId(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish event {}: {}", event.getEventType(), ex.getMessage());
                } else {
                    log.info("Published event {} to topic {}", event.getEventType(), topic);
                }
            });
    }
}
