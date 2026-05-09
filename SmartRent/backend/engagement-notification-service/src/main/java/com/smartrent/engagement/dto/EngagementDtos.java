package com.smartrent.engagement.dto;

import com.smartrent.engagement.entity.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

public class EngagementDtos {

    @Data public static class CreateReviewRequest {
        @NotNull private Integer propertyID;
        private Integer rentalID;
        @NotNull @Min(1) @Max(5) private Integer rating;
        private String comment;
    }

    @Data public static class FavoriteDto {
        private Integer favoriteID;
        private Integer propertyID;
        private LocalDateTime createdAt;

        public static FavoriteDto from(Favorite f) {
            FavoriteDto d = new FavoriteDto();
            d.favoriteID = f.getFavoriteID(); d.propertyID = f.getPropertyID();
            d.createdAt = f.getCreatedAt(); return d;
        }
    }

    @Data public static class ReviewDto {
        private Integer reviewID;
        private Integer propertyID;
        private Integer tenantID;
        private Integer rentalID;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;

        public static ReviewDto from(Review r) {
            ReviewDto d = new ReviewDto();
            d.reviewID = r.getReviewID(); d.propertyID = r.getPropertyID();
            d.tenantID = r.getTenantID(); d.rentalID = r.getRentalID();
            d.rating = r.getRating(); d.comment = r.getComment();
            d.createdAt = r.getCreatedAt(); return d;
        }
    }

    @Data public static class NotificationDto {
        private Integer notificationID;
        private Integer relatedID;
        private String type;
        private String title;
        private String message;
        private Boolean isRead;
        private LocalDateTime createdAt;

        public static NotificationDto from(Notification n) {
            NotificationDto d = new NotificationDto();
            d.notificationID = n.getNotificationID(); d.relatedID = n.getRelatedID();
            d.type = n.getType(); d.title = n.getTitle();
            d.message = n.getMessage(); d.isRead = n.getIsRead();
            d.createdAt = n.getCreatedAt(); return d;
        }
    }

    @Data public static class ApiResponse {
        private boolean success; private String message; private Object data;
        public static ApiResponse ok(String m) { ApiResponse r = new ApiResponse(); r.success=true; r.message=m; return r; }
        public static ApiResponse ok(String m, Object d) { ApiResponse r=ok(m); r.data=d; return r; }
    }
}
