package com.smartrent.property.controller;

import com.smartrent.property.dto.PropertyDtos.*;
import com.smartrent.property.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    // Public
    @GetMapping
    public ResponseEntity<List<PropertyDto>> getAll() {
        return ResponseEntity.ok(propertyService.getAllApproved());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(propertyService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyDto>> search(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(propertyService.search(location, type, minPrice, maxPrice));
    }

    // Landlord
    @GetMapping("/my")
    public ResponseEntity<List<PropertyDto>> getMyProperties(Authentication auth) {
        return ResponseEntity.ok(propertyService.getMyProperties((Integer) auth.getPrincipal()));
    }

    @PostMapping
    public ResponseEntity<PropertyDto> create(Authentication auth,
                                              @RequestBody CreatePropertyRequest req) {
        return ResponseEntity.ok(propertyService.createProperty((Integer) auth.getPrincipal(), req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> update(Authentication auth,
                                              @PathVariable Integer id,
                                              @RequestBody UpdatePropertyRequest req) {
        return ResponseEntity.ok(propertyService.updateProperty((Integer) auth.getPrincipal(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(
            Authentication auth,
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        Integer userId = (Integer) auth.getPrincipal();
        return ResponseEntity.ok(propertyService.deleteProperty(userId, role, id));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ImageDto> addImage(Authentication auth,
                                             @PathVariable Integer id,
                                             @RequestBody ImageRequest req) {
        return ResponseEntity.ok(propertyService.addImage((Integer) auth.getPrincipal(), id, req));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<ApiResponse> deleteImage(Authentication auth,
                                                   @PathVariable Integer id,
                                                   @PathVariable Integer imageId) {
        return ResponseEntity.ok(propertyService.deleteImage((Integer) auth.getPrincipal(), id, imageId));
    }

    @PostMapping("/{id}/amenities/{amenityId}")
    public ResponseEntity<ApiResponse> addAmenity(Authentication auth,
                                                  @PathVariable Integer id,
                                                  @PathVariable Integer amenityId) {
        return ResponseEntity.ok(propertyService.addAmenity((Integer) auth.getPrincipal(), id, amenityId));
    }

    @DeleteMapping("/{id}/amenities/{amenityId}")
    public ResponseEntity<ApiResponse> removeAmenity(Authentication auth,
                                                     @PathVariable Integer id,
                                                     @PathVariable Integer amenityId) {
        return ResponseEntity.ok(propertyService.removeAmenity((Integer) auth.getPrincipal(), id, amenityId));
    }

    // Admin
    @GetMapping("/pending")
    public ResponseEntity<List<PropertyDto>> getPending() {
        return ResponseEntity.ok(propertyService.getPendingProperties());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<PropertyDto> approve(Authentication auth, @PathVariable Integer id) {
        return ResponseEntity.ok(propertyService.approveProperty(id, (Integer) auth.getPrincipal()));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<PropertyDto> reject(Authentication auth, @PathVariable Integer id) {
        return ResponseEntity.ok(propertyService.rejectProperty(id, (Integer) auth.getPrincipal()));
    }
}
