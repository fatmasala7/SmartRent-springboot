package com.smartrent.booking.controller;

import com.smartrent.booking.dto.BookingDtos.*;
import com.smartrent.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApplicationDto> create(Authentication auth,
                                                 @RequestHeader(value = "X-User-Role", required = false) String role,
                                                 @RequestBody CreateApplicationRequest req) {
        return ResponseEntity.ok(bookingService.createApplication((Integer) auth.getPrincipal(), role, req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationDto>> myApplications(Authentication auth) {
        return ResponseEntity.ok(bookingService.getMyApplications((Integer) auth.getPrincipal()));
    }

    @GetMapping("/landlord")
    public ResponseEntity<List<ApplicationDto>> landlordApplications(Authentication auth,
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestParam(required = false, defaultValue = "") List<Integer> propertyIds) {
        return ResponseEntity.ok(bookingService.getLandlordApplications((Integer) auth.getPrincipal(), role, propertyIds));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getApplication(id));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApplicationDto> accept(Authentication auth,
                                                 @RequestHeader(value = "X-User-Role", required = false) String role,
                                                 @PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.acceptApplication(id, (Integer) auth.getPrincipal(), role));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApplicationDto> reject(Authentication auth,
                                                 @RequestHeader(value = "X-User-Role", required = false) String role,
                                                 @PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.rejectApplication(id, (Integer) auth.getPrincipal(), role));
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<DocumentDto> addDocument(Authentication auth,
                                                   @PathVariable Integer id,
                                                   @RequestBody AddDocumentRequest req) {
        return ResponseEntity.ok(bookingService.addDocument((Integer) auth.getPrincipal(), id, req));
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<DocumentDto>> getDocuments(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getDocuments(id));
    }

    @DeleteMapping("/{id}/documents/{docId}")
    public ResponseEntity<ApiResponse> deleteDocument(Authentication auth,
                                                      @PathVariable Integer id,
                                                      @PathVariable Integer docId) {
        return ResponseEntity.ok(bookingService.deleteDocument((Integer) auth.getPrincipal(), id, docId));
    }
}
