package com.smartrent.engagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reviews")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReviewID") private Integer reviewID;

    @Column(name = "PropertyID", nullable = false) private Integer propertyID;
    @Column(name = "TenantID",   nullable = false) private Integer tenantID;
    @Column(name = "RentalID")                     private Integer rentalID;

    @Column(name = "Rating", nullable = false)     private Integer rating;
    @Column(name = "Comment", columnDefinition = "TEXT") private String comment;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist public void prePersist() { createdAt = LocalDateTime.now(); }
}
