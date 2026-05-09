package com.smartrent.auth.config;

import com.smartrent.auth.entity.User;
import com.smartrent.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedAdminUser() {
        return args -> {
            User admin = userRepository.findByEmail("admin@smartrent.com")
                    .orElseGet(() -> User.builder()
                            .fullName("System Admin")
                            .email("admin@smartrent.com")
                            .phoneNumber("01000000000")
                            .nationalOrPassportID("ADMIN-001")
                            .role(User.Role.Admin)
                            .build());

            admin.setFullName(admin.getFullName() == null ? "System Admin" : admin.getFullName());
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(User.Role.Admin);
            admin.setIsApproved(true);
            admin.setIsActive(true);
            userRepository.save(admin);
        };
    }
}
