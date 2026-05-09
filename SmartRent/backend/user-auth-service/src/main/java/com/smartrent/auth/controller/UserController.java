package com.smartrent.auth.controller;

import com.smartrent.auth.dto.AuthDtos.*;
import com.smartrent.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(Authentication auth) {
        Integer userId = (Integer) auth.getPrincipal();
        return ResponseEntity.ok(authService.getMe(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMe(Authentication auth,
                                             @RequestBody UpdateProfileRequest req) {
        Integer userId = (Integer) auth.getPrincipal();
        return ResponseEntity.ok(authService.updateMe(userId, req));
    }

    // Admin endpoints
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/pending-landlords")
    public ResponseEntity<List<UserDto>> getPendingLandlords() {
        return ResponseEntity.ok(authService.getPendingLandlords());
    }

    @PutMapping("/{userId}/approve-landlord")
    public ResponseEntity<ApiResponse> approveLandlord(@PathVariable Integer userId,
                                                        Authentication auth) {
        Integer adminId = (Integer) auth.getPrincipal();
        return ResponseEntity.ok(authService.approveLandlord(userId, adminId));
    }

    @PutMapping("/{userId}/reject-landlord")
    public ResponseEntity<ApiResponse> rejectLandlord(@PathVariable Integer userId,
                                                       Authentication auth) {
        Integer adminId = (Integer) auth.getPrincipal();
        return ResponseEntity.ok(authService.rejectLandlord(userId, adminId));
    }

    @PutMapping("/{userId}/activate")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(authService.activateUser(userId));
    }

    @PutMapping("/{userId}/deactivate")
    public ResponseEntity<ApiResponse> deactivateUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(authService.deactivateUser(userId));
    }
}
