package com.smartrent.booking.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingEventProducer {

    private final KafkaTemplate<String, BookingEvent> kafkaTemplate;

    public void publish(String topic, BookingEvent event) {
        kafkaTemplate.send(topic, event.getEventId(), event)
            .whenComplete((r, ex) -> {
                if (ex != null) log.error("Failed to publish {}: {}", event.getEventType(), ex.getMessage());
                else log.info("Published {} to {}", event.getEventType(), topic);
            });
    }
}
