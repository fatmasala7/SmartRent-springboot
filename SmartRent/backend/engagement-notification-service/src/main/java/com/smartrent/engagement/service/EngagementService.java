package com.smartrent.engagement.service;

import com.smartrent.engagement.dto.EngagementDtos.*;
import com.smartrent.engagement.entity.*;
import com.smartrent.engagement.exception.AppException;
import com.smartrent.engagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EngagementService {

    private final FavoriteRepository favoriteRepo;
    private final ReviewRepository reviewRepo;
    private final NotificationRepository notificationRepo;

    // ===== FAVORITES =====
    @Transactional
    public ApiResponse addFavorite(Integer tenantId, String role, Integer propertyId) {
        requireTenant(role);
        if (favoriteRepo.existsByTenantIDAndPropertyID(tenantId, propertyId)) {
            return ApiResponse.ok("Already in favorites");
        }
        Favorite f = Favorite.builder().tenantID(tenantId).propertyID(propertyId).build();
        favoriteRepo.save(f);
        return ApiResponse.ok("Added to favorites");
    }

    @Transactional
    public ApiResponse removeFavorite(Integer tenantId, String role, Integer propertyId) {
        requireTenant(role);
        favoriteRepo.findByTenantIDAndPropertyID(tenantId, propertyId)
            .ifPresent(favoriteRepo::delete);
        return ApiResponse.ok("Removed from favorites");
    }

    public List<FavoriteDto> getMyFavorites(Integer tenantId, String role) {
        requireTenant(role);
        return favoriteRepo.findByTenantID(tenantId)
            .stream().map(FavoriteDto::from).collect(Collectors.toList());
    }

    // ===== REVIEWS =====
    @Transactional
    public ReviewDto createReview(Integer tenantId, CreateReviewRequest req) {
        Review r = Review.builder()
            .propertyID(req.getPropertyID())
            .tenantID(tenantId)
            .rentalID(req.getRentalID())
            .rating(req.getRating())
            .comment(req.getComment())
            .build();
        return ReviewDto.from(reviewRepo.save(r));
    }

    public List<ReviewDto> getPropertyReviews(Integer propertyId) {
        return reviewRepo.findByPropertyID(propertyId)
            .stream().map(ReviewDto::from).collect(Collectors.toList());
    }

    public List<ReviewDto> getMyReviews(Integer tenantId) {
        return reviewRepo.findByTenantID(tenantId)
            .stream().map(ReviewDto::from).collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse deleteReview(Integer tenantId, Integer reviewId) {
        Review r = reviewRepo.findById(reviewId)
            .orElseThrow(() -> new AppException("Review not found"));
        if (!r.getTenantID().equals(tenantId)) throw new AppException("Not your review");
        reviewRepo.delete(r);
        return ApiResponse.ok("Review deleted");
    }

    // ===== NOTIFICATIONS =====
    public List<NotificationDto> getMyNotifications(Integer userId) {
        return notificationRepo.findByUserIDOrderByCreatedAtDesc(userId)
            .stream().map(NotificationDto::from).collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse markRead(Integer userId, Integer notifId) {
        Notification n = findNotification(notifId, userId);
        n.setIsRead(true);
        notificationRepo.save(n);
        return ApiResponse.ok("Marked as read");
    }

    @Transactional
    public ApiResponse markAllRead(Integer userId) {
        List<Notification> list = notificationRepo.findByUserIDOrderByCreatedAtDesc(userId);
        list.forEach(n -> n.setIsRead(true));
        notificationRepo.saveAll(list);
        return ApiResponse.ok("All marked as read");
    }

    @Transactional
    public ApiResponse deleteNotification(Integer userId, Integer notifId) {
        Notification n = findNotification(notifId, userId);
        notificationRepo.delete(n);
        return ApiResponse.ok("Notification deleted");
    }

    private void requireTenant(String role) {
        if (role == null || !role.equalsIgnoreCase("Tenant")) {
            throw new AppException("Only tenants can use favorites");
        }
    }

    private Notification findNotification(Integer notifId, Integer userId) {
        Notification n = notificationRepo.findById(notifId)
            .orElseThrow(() -> new AppException("Notification not found"));
        if (!n.getUserID().equals(userId)) throw new AppException("Not your notification");
        return n;
    }
}
