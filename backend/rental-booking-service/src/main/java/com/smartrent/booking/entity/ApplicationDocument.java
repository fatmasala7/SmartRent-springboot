package com.smartrent.booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ApplicationDocuments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ApplicationDocument {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DocumentID") private Integer documentID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApplicationID", nullable = false)
    private RentalApplication application;

    @Column(name = "DocumentType", length = 100) private String documentType;
    @Column(name = "DocumentUrl", nullable = false, columnDefinition = "LONGTEXT") private String documentUrl;
}
