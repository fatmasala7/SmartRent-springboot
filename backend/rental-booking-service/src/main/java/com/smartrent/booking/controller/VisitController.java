package com.smartrent.booking.controller;

import com.smartrent.booking.dto.BookingDtos.*;
import com.smartrent.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
public class VisitController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<VisitRequestDto> create(Authentication auth,
                                                  @RequestBody CreateVisitRequest req) {
        return ResponseEntity.ok(bookingService.createVisit((Integer) auth.getPrincipal(), req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<VisitRequestDto>> myVisits(Authentication auth) {
        return ResponseEntity.ok(bookingService.getMyVisits((Integer) auth.getPrincipal()));
    }

    @GetMapping("/landlord")
    public ResponseEntity<List<VisitRequestDto>> landlordVisits(
            Authentication auth,
            @RequestParam(required = false, defaultValue = "") List<Integer> propertyIds) {
        if (propertyIds == null || propertyIds.isEmpty()) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
        return ResponseEntity.ok(bookingService.getLandlordVisits((Integer) auth.getPrincipal(), propertyIds));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<VisitRequestDto> accept(Authentication auth, @PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.acceptVisit(id, (Integer) auth.getPrincipal()));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<VisitRequestDto> reject(Authentication auth, @PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.rejectVisit(id, (Integer) auth.getPrincipal()));
    }
}
