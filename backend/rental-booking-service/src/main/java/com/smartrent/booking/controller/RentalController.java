package com.smartrent.booking.controller;

import com.smartrent.booking.dto.BookingDtos.*;
import com.smartrent.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final BookingService bookingService;

    @GetMapping("/my")
    public ResponseEntity<List<RentalDto>> myRentals(Authentication auth) {
        return ResponseEntity.ok(bookingService.getMyRentals((Integer) auth.getPrincipal()));
    }

    @GetMapping("/landlord")
    public ResponseEntity<List<RentalDto>> landlordRentals(@RequestParam List<Integer> propertyIds) {
        return ResponseEntity.ok(bookingService.getLandlordRentals(propertyIds));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getRental(id));
    }
}
