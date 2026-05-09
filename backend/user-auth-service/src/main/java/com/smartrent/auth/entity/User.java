package com.smartrent.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Integer userID;

    @Column(name = "FullName", nullable = false, length = 200)
    private String fullName;

    @Column(name = "Email", nullable = false, unique = true, length = 200)
    private String email;

    @Column(name = "PhoneNumber", length = 20)
    private String phoneNumber;

    @Column(name = "Password", nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false)
    private Role role;

    @Column(name = "IsApproved", nullable = false)
    private Boolean isApproved = false;

    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;

    @Column(name = "ProfileImage", columnDefinition = "LONGTEXT")
    private String profileImage;

    @Column(name = "NationalOrPassportID", length = 50)
    private String nationalOrPassportID;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (role == Role.Tenant) {
            isApproved = true;
        }
    }

    public enum Role {
        Admin, Landlord, Tenant
    }
}
