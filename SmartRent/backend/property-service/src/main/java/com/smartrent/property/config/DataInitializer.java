package com.smartrent.property.config;

import com.smartrent.property.entity.Amenity;
import com.smartrent.property.repository.AmenityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final AmenityRepository amenityRepository;

    @Bean
    CommandLineRunner seedDefaultAmenities() {
        return args -> {
            if (amenityRepository.count() > 0) return;
            List<String> defaults = List.of(
                "WiFi",
                "Air Conditioning",
                "Parking",
                "Balcony",
                "Security",
                "Elevator",
                "Furnished",
                "Pet Friendly"
            );
            defaults.forEach(name -> amenityRepository.save(Amenity.builder().amenityName(name).build()));
        };
    }
}
