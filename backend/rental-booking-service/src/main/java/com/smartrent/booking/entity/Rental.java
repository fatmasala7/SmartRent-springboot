package com.smartrent.booking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Rentals")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Rental {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RentalID") private Integer rentalID;

    @Column(name = "ApplicationID", nullable = false, unique = true)
    private Integer applicationID;

    @Column(name = "RentStartDate", nullable = false) private LocalDate rentStartDate;
    @Column(name = "RentEndDate",   nullable = false) private LocalDate rentEndDate;

    @Column(name = "FinalPrice", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalPrice;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist public void prePersist() { createdAt = LocalDateTime.now(); }
}
