package com.smartrent.booking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "RentalApplications")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RentalApplication {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ApplicationID") private Integer applicationID;

    @Column(name = "PropertyID", nullable = false) private Integer propertyID;
    @Column(name = "TenantID",   nullable = false) private Integer tenantID;
    @Column(name = "LandlordID") private Integer landlordID;
    @Column(name = "StartDate",  nullable = false) private LocalDate startDate;
    @Column(name = "EndDate",    nullable = false) private LocalDate endDate;

    @Column(name = "JobTitle", length = 200) private String jobTitle;
    @Column(name = "MonthlyIncome", precision = 12, scale = 2) private BigDecimal monthlyIncome;
    @Column(name = "RentalDuration") private Integer rentalDuration;
    @Column(name = "Notes", columnDefinition = "TEXT") private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private Status status = Status.Pending;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ApplicationDocument> documents = new ArrayList<>();

    @PrePersist public void prePersist() {
        createdAt = LocalDateTime.now();
        if (documents == null) documents = new ArrayList<>();
    }

    public enum Status { Pending, Accepted, Rejected }
}
