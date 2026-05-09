package com.smartrent.engagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Favorites")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Favorite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FavoriteID") private Integer favoriteID;

    @Column(name = "TenantID", nullable = false)   private Integer tenantID;
    @Column(name = "PropertyID", nullable = false)  private Integer propertyID;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist public void prePersist() { createdAt = LocalDateTime.now(); }
}
