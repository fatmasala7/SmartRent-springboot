package com.smartrent.property.kafka;

import com.smartrent.property.entity.Property;
import com.smartrent.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import java.util.List;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PropertyKafkaHandler {

    private final KafkaTemplate<String, PropertyEvent> kafkaTemplate;
    private final PropertyRepository propertyRepo;

    public void publish(String topic, PropertyEvent event) {
        kafkaTemplate.send(topic, event.getEventId(), event)
            .whenComplete((r, ex) -> {
                if (ex != null) log.error("Kafka publish failed: {}", ex.getMessage());
                else log.info("Published {} to {}", event.getEventType(), topic);
            });
    }

    @KafkaListener(topics = "booking-events", groupId = "property-service-group")
    public void consumeBookingEvents(BookingEvent event) {
        log.info("Property service received booking event: {}", event.getEventType());
        if ("ApplicationAccepted".equals(event.getEventType()) && event.getRelatedId() != null) {
            // relatedId here is the propertyID passed from booking service
            propertyRepo.findById(event.getRelatedId()).ifPresent(p -> {
                p.setRentalStatus(Property.RentalStatus.Rented);
                propertyRepo.save(p);
                log.info("Property {} marked as Rented", event.getRelatedId());
            });
        }
    }

    @KafkaListener(topics = "user-events", groupId = "property-service-user-group", containerFactory = "userKafkaListenerContainerFactory")
    public void consumeUserEvents(UserEvent event) {
        log.info("Property service received user event: {}", event.getEventType());
        if ("LandlordDeactivated".equals(event.getEventType()) && event.getRelatedId() != null) {
            // Deactivate all properties of this landlord
            List<Property> props = propertyRepo.findByLandlordID(event.getRelatedId());
            props.forEach(p -> p.setIsActive(false));
            propertyRepo.saveAll(props);
            log.info("Deactivated {} properties for landlord {}", props.size(), event.getRelatedId());
        }
    }
}