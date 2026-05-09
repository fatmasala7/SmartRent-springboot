package com.smartrent.booking.config;

import com.smartrent.booking.kafka.BookingEvent;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

@Configuration
public class KafkaConfig {
    @Bean public NewTopic bookingEventsTopic() {
        return TopicBuilder.name("booking-events").partitions(1).replicas(1).build();
    }
    @Bean
    public KafkaTemplate<String, BookingEvent> kafkaTemplate(ProducerFactory<String, BookingEvent> pf) {
        return new KafkaTemplate<>(pf);
    }
}
