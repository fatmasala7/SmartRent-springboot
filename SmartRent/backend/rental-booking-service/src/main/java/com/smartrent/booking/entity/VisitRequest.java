package com.smartrent.booking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "VisitRequests")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class VisitRequest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RequestID") private Integer requestID;

    @Column(name = "PropertyID", nullable = false) private Integer propertyID;
    @Column(name = "TenantID", nullable = false)   private Integer tenantID;

    @Column(name = "RequestedDate", nullable = false)
    private LocalDateTime requestedDate;

    @Column(name = "Message", columnDefinition = "TEXT") private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private Status status = Status.Pending;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist public void prePersist() { createdAt = LocalDateTime.now(); }

    public enum Status { Pending, Accepted, Rejected }
}
