package com.smartrent.property.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Amenities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AmenityID")
    private Integer amenityID;

    @Column(name = "AmenityName", nullable = false, unique = true, length = 200)
    private String amenityName;
}
