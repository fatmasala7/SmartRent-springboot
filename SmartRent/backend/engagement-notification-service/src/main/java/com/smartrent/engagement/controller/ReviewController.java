package com.smartrent.engagement.controller;

import com.smartrent.engagement.dto.EngagementDtos.*;
import com.smartrent.engagement.service.EngagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {
    private final EngagementService engagementService;

    @PostMapping("/api/reviews")
    public ResponseEntity<ReviewDto> create(Authentication auth,
                                            @Valid @RequestBody CreateReviewRequest req) {
        return ResponseEntity.ok(engagementService.createReview((Integer) auth.getPrincipal(), req));
    }

    @GetMapping("/api/properties/{propertyId}/reviews")
    public ResponseEntity<List<ReviewDto>> getPropertyReviews(@PathVariable Integer propertyId) {
        return ResponseEntity.ok(engagementService.getPropertyReviews(propertyId));
    }

    @GetMapping("/api/reviews/my")
    public ResponseEntity<List<ReviewDto>> myReviews(Authentication auth) {
        return ResponseEntity.ok(engagementService.getMyReviews((Integer) auth.getPrincipal()));
    }

    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<ApiResponse> delete(Authentication auth, @PathVariable Integer id) {
        return ResponseEntity.ok(engagementService.deleteReview((Integer) auth.getPrincipal(), id));
    }
}
