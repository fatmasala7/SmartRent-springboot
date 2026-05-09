package com.smartrent.property.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "Properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PropertyID")
    private Integer propertyID;

    @Column(name = "LandlordID", nullable = false)
    private Integer landlordID;

    @Column(name = "ApprovedByAdminID")
    private Integer approvedByAdminID;

    @Column(name = "Title", nullable = false, length = 300)
    private String title;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "Location", length = 300)
    private String location;

    @Column(name = "PropertyType", length = 100)
    private String propertyType;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "RentalStatus", nullable = false)
    private RentalStatus rentalStatus = RentalStatus.Available;

    @Builder.Default
    @Column(name = "IsApproved", nullable = false)
    private Boolean isApproved = false;

    @Builder.Default
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PropertyImage> images = new ArrayList<>();

    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "PropertyAmenities",
        joinColumns = @JoinColumn(name = "PropertyID"),
        inverseJoinColumns = @JoinColumn(name = "AmenityID")
    )
    private Set<Amenity> amenities = new HashSet<>();

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (rentalStatus == null) {
            rentalStatus = RentalStatus.Available;
        }

        if (isApproved == null) {
            isApproved = false;
        }

        if (isActive == null) {
            isActive = true;
        }

        if (images == null) {
            images = new ArrayList<>();
        }

        if (amenities == null) {
            amenities = new HashSet<>();
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();

        if (images == null) {
            images = new ArrayList<>();
        }

        if (amenities == null) {
            amenities = new HashSet<>();
        }
    }

    public enum RentalStatus {
        Available,
        Rented,
        Pending
    }
}