package com.smartrent.auth.dto;

import com.smartrent.auth.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

public class AuthDtos {

    @Data
    public static class RegisterRequest {
        @NotBlank private String fullName;
        @Email @NotBlank private String email;
        @NotBlank private String password;
        private String phoneNumber;
        private String nationalOrPassportID;
        private String profileImage;
        @NotNull private User.Role role;
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private UserDto user;
    }

    @Data
    public static class UserDto {
        private Integer userID;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String role;
        private Boolean isApproved;
        private Boolean isActive;
        private String profileImage;
        private String nationalOrPassportID;
        private LocalDateTime createdAt;

        public static UserDto from(User u) {
            UserDto d = new UserDto();
            d.userID = u.getUserID();
            d.fullName = u.getFullName();
            d.email = u.getEmail();
            d.phoneNumber = u.getPhoneNumber();
            d.role = u.getRole().name();
            d.isApproved = u.getIsApproved();
            d.isActive = u.getIsActive();
            d.profileImage = u.getProfileImage();
            d.nationalOrPassportID = u.getNationalOrPassportID();
            d.createdAt = u.getCreatedAt();
            return d;
        }
    }

    @Data
    public static class UpdateProfileRequest {
        private String fullName;
        private String phoneNumber;
        private String profileImage;
        private String nationalOrPassportID;
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
