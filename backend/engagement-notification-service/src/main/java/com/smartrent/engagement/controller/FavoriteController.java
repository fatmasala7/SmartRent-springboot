package com.smartrent.engagement.controller;

import com.smartrent.engagement.dto.EngagementDtos.*;
import com.smartrent.engagement.service.EngagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    private final EngagementService engagementService;

    @PostMapping("/{propertyId}")
    public ResponseEntity<ApiResponse> add(Authentication auth,
                                           @RequestHeader(value = "X-User-Role", required = false) String role,
                                           @PathVariable Integer propertyId) {
        return ResponseEntity.ok(engagementService.addFavorite((Integer) auth.getPrincipal(), role, propertyId));
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<ApiResponse> remove(Authentication auth,
                                              @RequestHeader(value = "X-User-Role", required = false) String role,
                                              @PathVariable Integer propertyId) {
        return ResponseEntity.ok(engagementService.removeFavorite((Integer) auth.getPrincipal(), role, propertyId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<FavoriteDto>> getMyFavorites(Authentication auth,
                                                            @RequestHeader(value = "X-User-Role", required = false) String role) {
        return ResponseEntity.ok(engagementService.getMyFavorites((Integer) auth.getPrincipal(), role));
    }
}
