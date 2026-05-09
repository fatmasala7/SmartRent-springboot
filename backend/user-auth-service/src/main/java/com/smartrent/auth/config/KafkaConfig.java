package com.smartrent.auth.config;

import com.smartrent.auth.kafka.UserEvent;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic userEventsTopic() {
        return TopicBuilder.name("user-events").partitions(1).replicas(1).build();
    }

    @Bean
    public KafkaTemplate<String, UserEvent> kafkaTemplate(ProducerFactory<String, UserEvent> pf) {
        return new KafkaTemplate<>(pf);
    }
}
