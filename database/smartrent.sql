-- SmartRent Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS smartrent CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartrent;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    UserID      INT AUTO_INCREMENT PRIMARY KEY,
    FullName    VARCHAR(200) NOT NULL,
    Email       VARCHAR(200) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(20),
    Password    VARCHAR(255) NOT NULL,  -- BCrypt hashed
    Role        ENUM('Admin','Landlord','Tenant') NOT NULL DEFAULT 'Tenant',
    IsApproved  TINYINT(1) NOT NULL DEFAULT 0,
    IsActive    TINYINT(1) NOT NULL DEFAULT 1,
    ProfileImage LONGTEXT,
    NationalOrPassportID VARCHAR(50),
    CreatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Properties Table
CREATE TABLE IF NOT EXISTS Properties (
    PropertyID        INT AUTO_INCREMENT PRIMARY KEY,
    LandlordID        INT NOT NULL,
    ApprovedByAdminID INT,
    Title             VARCHAR(300) NOT NULL,
    Description       TEXT,
    Price             DECIMAL(10,2) NOT NULL,
    Location          VARCHAR(300),
    PropertyType      VARCHAR(100),
    RentalStatus      ENUM('Available','Rented','Pending') NOT NULL DEFAULT 'Available',
    IsApproved        TINYINT(1) NOT NULL DEFAULT 0,
    IsActive          TINYINT(1) NOT NULL DEFAULT 1,
    CreatedAt         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_property_landlord FOREIGN KEY (LandlordID) REFERENCES Users(UserID),
    CONSTRAINT fk_property_admin    FOREIGN KEY (ApprovedByAdminID) REFERENCES Users(UserID)
);

-- PropertyImages Table
CREATE TABLE IF NOT EXISTS PropertyImages (
    ImageID    INT AUTO_INCREMENT PRIMARY KEY,
    PropertyID INT NOT NULL,
    ImageUrl   VARCHAR(500) NOT NULL,
    IsMain     TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_img_property FOREIGN KEY (PropertyID) REFERENCES Properties(PropertyID) ON DELETE CASCADE
);

-- Amenities Table
CREATE TABLE IF NOT EXISTS Amenities (
    AmenityID   INT AUTO_INCREMENT PRIMARY KEY,
    AmenityName VARCHAR(200) NOT NULL UNIQUE
);

-- PropertyAmenities Table
CREATE TABLE IF NOT EXISTS PropertyAmenities (
    PropertyID INT NOT NULL,
    AmenityID  INT NOT NULL,
    PRIMARY KEY (PropertyID, AmenityID),
    CONSTRAINT fk_pa_property FOREIGN KEY (PropertyID) REFERENCES Properties(PropertyID) ON DELETE CASCADE,
    CONSTRAINT fk_pa_amenity  FOREIGN KEY (AmenityID)  REFERENCES Amenities(AmenityID)  ON DELETE CASCADE
);

-- VisitRequests Table
CREATE TABLE IF NOT EXISTS VisitRequests (
    RequestID     INT AUTO_INCREMENT PRIMARY KEY,
    PropertyID    INT NOT NULL,
    TenantID      INT NOT NULL,
    RequestedDate DATETIME NOT NULL,
    Message       TEXT,
    Status        ENUM('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
    CreatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_visit_property FOREIGN KEY (PropertyID) REFERENCES Properties(PropertyID),
    CONSTRAINT fk_visit_tenant   FOREIGN KEY (TenantID)   REFERENCES Users(UserID)
);

-- RentalApplications Table
CREATE TABLE IF NOT EXISTS RentalApplications (
    ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
    PropertyID    INT NOT NULL,
    TenantID      INT NOT NULL,
    LandlordID    INT,
    StartDate     DATE NOT NULL,
    EndDate       DATE NOT NULL,
    JobTitle      VARCHAR(200),
    MonthlyIncome DECIMAL(12,2),
    RentalDuration INT,
    Notes         TEXT,
    Status        ENUM('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
    CreatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_property FOREIGN KEY (PropertyID) REFERENCES Properties(PropertyID),
    CONSTRAINT fk_app_tenant   FOREIGN KEY (TenantID)   REFERENCES Users(UserID),
    CONSTRAINT fk_app_landlord FOREIGN KEY (LandlordID) REFERENCES Users(UserID)
);

-- ApplicationDocuments Table
CREATE TABLE IF NOT EXISTS ApplicationDocuments (
    DocumentID    INT AUTO_INCREMENT PRIMARY KEY,
    ApplicationID INT NOT NULL,
    DocumentType  VARCHAR(100),
    DocumentUrl   LONGTEXT NOT NULL,
    CONSTRAINT fk_doc_application FOREIGN KEY (ApplicationID) REFERENCES RentalApplications(ApplicationID) ON DELETE CASCADE
);

-- Rentals Table
CREATE TABLE IF NOT EXISTS Rentals (
    RentalID      INT AUTO_INCREMENT PRIMARY KEY,
    ApplicationID INT NOT NULL UNIQUE,
    RentStartDate DATE NOT NULL,
    RentEndDate   DATE NOT NULL,
    FinalPrice    DECIMAL(10,2) NOT NULL,
    CreatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rental_application FOREIGN KEY (ApplicationID) REFERENCES RentalApplications(ApplicationID)
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS Favorites (
    FavoriteID INT AUTO_INCREMENT PRIMARY KEY,
    TenantID   INT NOT NULL,
    PropertyID INT NOT NULL,
    CreatedAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_favorite (TenantID, PropertyID),
    CONSTRAINT fk_fav_tenant   FOREIGN KEY (TenantID)   REFERENCES Users(UserID),
    CONSTRAINT fk_fav_property FOREIGN KEY (PropertyID) REFERENCES Properties(PropertyID)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS Reviews (
    ReviewID   INT AUTO_INCREMENT PRIMARY KEY,
    PropertyID INT NOT NULL,
    TenantID   INT NOT NULL,
    RentalID   INT,
    Rating     INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment    TEXT,
    CreatedAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_property FOREIGN KEY (PropertyID) REFERENCES Properties(PropertyID),
    CONSTRAINT fk_review_tenant   FOREIGN KEY (TenantID)   REFERENCES Users(UserID),
    CONSTRAINT fk_review_rental   FOREIGN KEY (RentalID)   REFERENCES Rentals(RentalID)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS Notifications (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    UserID         INT NOT NULL,
    RelatedID      INT,
    Type           VARCHAR(100),
    Title          VARCHAR(300),
    Message        TEXT,
    IsRead         TINYINT(1) NOT NULL DEFAULT 0,
    CreatedAt      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Seed admin user (password: Admin@123)
INSERT INTO Users (
    FullName,
    Email,
    PhoneNumber,
    Password,
    Role,
    IsApproved,
    IsActive,
    NationalOrPassportID
)
VALUES (
    'System Admin',
    'admin@smartrent.com',
    '01000000000',
    '$2y$12$c2jMUgiysITSadoCUhB4T.HFKhohLAm7yGsG9FXVAiKHpcZk/NVES',
    'Admin',
    1,
    1,
    'ADMIN-001'
);

-- Seed some amenities
INSERT INTO Amenities (AmenityName) VALUES
('WiFi'),('Parking'),('Air Conditioning'),('Heating'),('Washer'),
('Dryer'),('Swimming Pool'),('Gym'),('Elevator'),('Balcony'),
('Security'),('Furnished'),('Pet Friendly'),('Garden'),('Dishwasher');
