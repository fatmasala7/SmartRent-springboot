package com.smartrent.property.dto;

import com.smartrent.property.entity.Amenity;
import com.smartrent.property.entity.Property;
import com.smartrent.property.entity.PropertyImage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Comparator;
import java.util.stream.Collectors;

public class PropertyDtos {

    @Data
    public static class CreatePropertyRequest {
        @NotBlank private String title;
        private String description;
        @NotNull private BigDecimal price;
        private String location;
        private String propertyType;
    }

    @Data
    public static class UpdatePropertyRequest {
        private String title;
        private String description;
        private BigDecimal price;
        private String location;
        private String propertyType;
        private Boolean isActive;
    }

    @Data
    public static class ImageRequest {
        @NotBlank private String imageUrl;
        private Boolean isMain = false;
    }

    @Data
    public static class AmenityRequest {
        @NotBlank private String amenityName;
    }

    @Data
    public static class PropertyDto {
        private Integer propertyID;
        private Integer landlordID;
        private Integer approvedByAdminID;
        private String title;
        private String description;
        private BigDecimal price;
        private String location;
        private String propertyType;
        private String rentalStatus;
        private Boolean isApproved;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<ImageDto> images;
        private String mainImageUrl;
        private String imageUrl;
        private List<AmenityDto> amenities;

        public static PropertyDto from(Property p) {
            PropertyDto d = new PropertyDto();
            d.propertyID = p.getPropertyID();
            d.landlordID = p.getLandlordID();
            d.approvedByAdminID = p.getApprovedByAdminID();
            d.title = p.getTitle();
            d.description = p.getDescription();
            d.price = p.getPrice();
            d.location = p.getLocation();
            d.propertyType = p.getPropertyType();
            d.rentalStatus = p.getRentalStatus() == null ? null : p.getRentalStatus().name();
            d.isApproved = p.getIsApproved();
            d.isActive = p.getIsActive();
            d.createdAt = p.getCreatedAt();
            d.updatedAt = p.getUpdatedAt();
            d.images = p.getImages() == null ? List.of() : p.getImages().stream()
                    .filter(img -> img.getImageUrl() != null && !img.getImageUrl().isBlank())
                    .sorted(Comparator.comparing((PropertyImage img) -> !Boolean.TRUE.equals(img.getIsMain()))
                            .thenComparing(PropertyImage::getImageID, Comparator.nullsLast(Integer::compareTo)))
                    .map(ImageDto::from)
                    .collect(Collectors.toList());
            d.mainImageUrl = d.images.stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsMain()))
                    .map(ImageDto::getImageUrl)
                    .findFirst()
                    .orElse(d.images.isEmpty() ? null : d.images.get(0).getImageUrl());
            d.imageUrl = d.mainImageUrl;
            d.amenities = p.getAmenities() == null ? List.of() : p.getAmenities().stream().map(AmenityDto::from).collect(Collectors.toList());
            return d;
        }
    }

    @Data
    public static class ImageDto {
        private Integer imageID;
        private String imageUrl;
        private Boolean isMain;

        public static ImageDto from(PropertyImage img) {
            ImageDto d = new ImageDto();
            d.imageID = img.getImageID();
            d.imageUrl = img.getImageUrl();
            d.isMain = img.getIsMain();
            return d;
        }
    }

    @Data
    public static class AmenityDto {
        private Integer amenityID;
        private String amenityName;

        public static AmenityDto from(Amenity a) {
            AmenityDto d = new AmenityDto();
            d.amenityID = a.getAmenityID();
            d.amenityName = a.getAmenityName();
            return d;
        }
    }

    @Data
    public static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;

        public static ApiResponse ok(String message) {
            ApiResponse r = new ApiResponse(); r.success = true; r.message = message; return r;
        }
        public static ApiResponse ok(String message, Object data) {
            ApiResponse r = ok(message); r.data = data; return r;
        }
        public static ApiResponse fail(String message) {
            ApiResponse r = new ApiResponse(); r.success = false; r.message = message; return r;
        }
    }
}
