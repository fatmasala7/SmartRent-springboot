package com.smartrent.property.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PropertyImages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ImageID")
    private Integer imageID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PropertyID", nullable = false)
    private Property property;

    @Column(name = "ImageUrl", nullable = false, length = 500)
    private String imageUrl;

    @Builder.Default
    @Column(name = "IsMain", nullable = false)
    private Boolean isMain = false;
}
