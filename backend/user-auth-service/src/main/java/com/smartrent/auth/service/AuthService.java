package com.smartrent.auth.service;

import com.smartrent.auth.dto.AuthDtos.*;
import com.smartrent.auth.entity.User;
import com.smartrent.auth.exception.AppException;
import com.smartrent.auth.kafka.UserEvent;
import com.smartrent.auth.kafka.UserEventProducer;
import com.smartrent.auth.repository.UserRepository;
import com.smartrent.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserEventProducer eventProducer;

    @Transactional
    public ApiResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new AppException("Email already registered");
        }
        User user = User.builder()
            .fullName(req.getFullName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .phoneNumber(req.getPhoneNumber())
            .nationalOrPassportID(req.getNationalOrPassportID())
            .profileImage(req.getProfileImage())
            .role(req.getRole())
            .isActive(true)
            .isApproved(req.getRole() == User.Role.Tenant)
            .build();

        user = userRepo.save(user);

        // Publish UserRegistered event
        eventProducer.publish("user-events", UserEvent.of(
            "UserRegistered", user.getUserID(), null, user.getUserID(),
            "Welcome to SmartRent, " + user.getFullName() + "!"
        ));

        String msg = user.getRole() == User.Role.Landlord
            ? "Registration successful. Await admin approval before adding properties."
            : "Registration successful. Welcome!";
        return ApiResponse.ok(msg);
    }

    public LoginResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new AppException("Invalid email or password"));

        if (!user.getIsActive()) throw new AppException("Account is deactivated");
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new AppException("Invalid email or password");
        }
        if (user.getRole() == User.Role.Landlord && !Boolean.TRUE.equals(user.getIsApproved())) {
            throw new AppException("Your landlord account is pending admin approval.");
        }

        String token = jwtUtil.generateToken(user.getUserID(), user.getEmail(), user.getRole().name());

        LoginResponse resp = new LoginResponse();
        resp.setToken(token);
        resp.setUser(UserDto.from(user));
        return resp;
    }

    public UserDto getMe(Integer userId) {
        return UserDto.from(findUser(userId));
    }

    @Transactional
    public UserDto updateMe(Integer userId, UpdateProfileRequest req) {
        User user = findUser(userId);
        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getPhoneNumber() != null) user.setPhoneNumber(req.getPhoneNumber());
        if (req.getProfileImage() != null) user.setProfileImage(req.getProfileImage());
        if (req.getNationalOrPassportID() != null) user.setNationalOrPassportID(req.getNationalOrPassportID());
        return UserDto.from(userRepo.save(user));
    }

    public List<UserDto> getAllUsers() {
        return userRepo.findAll().stream().map(UserDto::from).collect(Collectors.toList());
    }

    public List<UserDto> getPendingLandlords() {
        return userRepo.findByRoleAndIsApprovedFalseAndIsActiveTrue(User.Role.Landlord)
            .stream().map(UserDto::from).collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse approveLandlord(Integer userId, Integer adminId) {
        User user = findUser(userId);
        if (user.getRole() != User.Role.Landlord) throw new AppException("User is not a landlord");
        user.setIsApproved(true);
        userRepo.save(user);

        eventProducer.publish("user-events", UserEvent.of(
            "LandlordApproved", userId, adminId, userId,
            "Your landlord account has been approved. You can now add properties."
        ));
        return ApiResponse.ok("Landlord approved successfully");
    }

    @Transactional
    public ApiResponse rejectLandlord(Integer userId, Integer adminId) {
        User user = findUser(userId);
        user.setIsApproved(false);
        user.setIsActive(false);
        userRepo.save(user);

        eventProducer.publish("user-events", UserEvent.of(
            "LandlordRejected", userId, adminId, userId,
            "Your landlord account application has been rejected."
        ));
        return ApiResponse.ok("Landlord rejected");
    }

    @Transactional
    public ApiResponse activateUser(Integer userId) {
        User user = findUser(userId);
        user.setIsActive(true);
        userRepo.save(user);
        return ApiResponse.ok("User activated");
    }

    @Transactional
    public ApiResponse deactivateUser(Integer userId) {
        User user = findUser(userId);
        user.setIsActive(false);
        userRepo.save(user);

        // If landlord, publish event so property-service can deactivate their properties
        if (user.getRole() == User.Role.Landlord) {
            eventProducer.publish("user-events", UserEvent.of(
                "LandlordDeactivated", userId, null, userId,
                "Landlord account deactivated. Properties will be deactivated."
            ));
        }
        return ApiResponse.ok("User deactivated");
    }

    private User findUser(Integer userId) {
        return userRepo.findById(userId)
            .orElseThrow(() -> new AppException("User not found"));
    }
}
