# Software Requirements Specification (SRS)
## SmartRent — Property Rental Platform

**Version:** 1.0  
**Date:** 2024  
**Project:** SmartRent  

---

## 1. Introduction

### 1.1 Purpose
This SRS describes the functional and non-functional requirements for SmartRent, a web-based
property rental platform that connects landlords and tenants through a microservices backend
and a React frontend.

### 1.2 Scope
SmartRent allows:
- **Tenants** to browse, favorite, visit, and apply to rent properties, upload documents, and leave reviews.
- **Landlords** to register (pending admin approval), list properties, manage visit requests, and accept/reject rental applications.
- **Admins** to approve landlords, approve/reject properties, and manage user accounts.

The system is built as independent microservices communicating via Apache Kafka and exposed
through a Spring Cloud Gateway.

### 1.3 Definitions

| Term | Definition |
|---|---|
| JWT | JSON Web Token — stateless authentication mechanism |
| API Gateway | Single entry point for all frontend requests |
| Kafka | Distributed event streaming platform for async communication |
| BCrypt | Password hashing algorithm |
| AOP | Aspect-Oriented Programming — cross-cutting concerns |
| Microservice | Independently deployable service with a single responsibility |
| Tenant | A user looking to rent a property |
| Landlord | A user who lists properties for rent |
| Admin | A privileged user who approves landlords and properties |

---

## 2. Overall Description

### 2.1 Product Perspective
SmartRent is a multi-role web application consisting of:
- 4 Spring Boot microservices
- 1 Spring Cloud Gateway
- Apache Kafka for async messaging
- A shared MySQL database
- A React single-page application (SPA)

### 2.2 User Classes

#### Admin
- Has full system access
- Can approve or reject landlord registrations
- Can approve or reject property listings
- Can activate or deactivate any user account
- Seeded in the database at initialization

#### Landlord
- Must register and wait for admin approval
- Can add, edit, and deactivate properties after approval
- Can manage visit requests for their properties
- Can accept or reject rental applications
- Cannot rent properties themselves

#### Tenant
- Can register immediately and is auto-approved
- Can browse and search all approved properties
- Can add properties to favorites
- Can request property visits
- Can submit rental applications with documents
- Can leave reviews after completing a rental
- Can view notifications

### 2.3 Assumptions and Constraints
- All services share a single MySQL database (monolithic DB pattern)
- Images and documents are stored as URLs (no file upload server in scope)
- Kafka runs as a single broker (replication factor = 1) for simplicity
- JWT tokens expire after 24 hours
- Admin account is seeded; self-registration as Admin is not allowed

---

## 3. Functional Requirements

### 3.1 User / Auth Module (user-auth-service)

| ID | Requirement |
|---|---|
| FR-1.1 | The system shall allow tenants and landlords to register with fullName, email, password, phoneNumber, nationalOrPassportID, and role |
| FR-1.2 | The system shall hash passwords using BCrypt before storing |
| FR-1.3 | The system shall auto-approve tenants upon registration |
| FR-1.4 | The system shall require admin approval for landlords |
| FR-1.5 | The system shall return a JWT on successful login |
| FR-1.6 | The system shall allow authenticated users to view and update their profile |
| FR-1.7 | Admins shall be able to list all users, pending landlords |
| FR-1.8 | Admins shall be able to approve or reject landlord registrations |
| FR-1.9 | Admins shall be able to activate or deactivate any user |
| FR-1.10 | Publishing a `UserRegistered` event shall trigger a welcome notification |
| FR-1.11 | Publishing a `LandlordApproved` event shall trigger a landlord approval notification |

### 3.2 Property Management Module (property-service)

| ID | Requirement |
|---|---|
| FR-2.1 | Any user (including unauthenticated) shall be able to browse approved, active properties |
| FR-2.2 | Properties shall be searchable by location, type, and price range |
| FR-2.3 | Landlords (approved only) shall be able to create, update, and deactivate properties |
| FR-2.4 | New properties shall default to pending (IsApproved = false) |
| FR-2.5 | Admins shall be able to view, approve, or reject pending properties |
| FR-2.6 | Landlords shall be able to add and remove images from their properties |
| FR-2.7 | Landlords shall be able to assign amenities to their properties |
| FR-2.8 | Upon `ApplicationAccepted` Kafka event, the property's RentalStatus shall be updated to Rented |
| FR-2.9 | Publishing `PropertySubmitted` shall notify admin |
| FR-2.10 | Publishing `PropertyApproved` shall notify the landlord |

### 3.3 Rental / Booking Module (rental-booking-service)

| ID | Requirement |
|---|---|
| FR-3.1 | Tenants shall be able to create visit requests for approved properties |
| FR-3.2 | Landlords shall be able to accept or reject visit requests for their properties |
| FR-3.3 | Tenants shall be able to submit rental applications with start and end dates |
| FR-3.4 | Tenants shall be able to upload documents to their applications |
| FR-3.5 | Landlords shall be able to accept or reject rental applications |
| FR-3.6 | Accepting an application shall automatically create a Rental record |
| FR-3.7 | Accepting/rejecting an application shall publish the appropriate Kafka event |
| FR-3.8 | Tenants and landlords shall be able to view their respective rentals |

### 3.4 Engagement / Notification Module (engagement-notification-service)

| ID | Requirement |
|---|---|
| FR-4.1 | Tenants shall be able to add and remove properties from their favorites |
| FR-4.2 | Tenants shall be able to view their favorites list |
| FR-4.3 | Tenants shall be able to write reviews for properties they have rented |
| FR-4.4 | All users shall be able to view reviews for any property |
| FR-4.5 | The notification service shall listen to all Kafka topics and persist relevant notifications |
| FR-4.6 | Users shall be able to view, mark as read, and delete their notifications |

---

## 4. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Security | All passwords must be stored as BCrypt hashes |
| NFR-2 | Security | All protected API routes must require a valid JWT |
| NFR-3 | Security | Role-based access must be enforced at both gateway and service level |
| NFR-4 | Scalability | Each microservice must be independently deployable and scalable |
| NFR-5 | Availability | Services must restart automatically on failure (Docker restart policy) |
| NFR-6 | Maintainability | Each service must follow a layered architecture: Controller → Service → Repository |
| NFR-7 | Observability | AOP logging must log method entry, exit, and execution time for all controllers and services |
| NFR-8 | Observability | Sensitive admin/landlord actions must be audit-logged via AOP |
| NFR-9 | Performance | CORS must be configured at the gateway to support the frontend |
| NFR-10 | Reliability | Kafka producers must use async callbacks to log publish failures |

---

## 5. System Architecture

```
[React SPA] → [Spring Cloud Gateway :8080]
                     ↓ JWT validated
           ┌─────────┬──────────┬──────────────┐
      user-auth   property   booking      engagement
      :8081       :8082       :8083         :8084
           └────────────────────────────────────┘
                         ↕ Kafka
                    [MySQL :3306]
```

---

## 6. Database Design

The system uses a shared MySQL database with the following tables:

- **Users** — stores all user accounts (Admin, Landlord, Tenant)
- **Properties** — rental property listings with approval/status flags
- **PropertyImages** — images linked to properties
- **Amenities** — reference list of amenity types
- **PropertyAmenities** — many-to-many between Properties and Amenities
- **VisitRequests** — tenant visit scheduling
- **RentalApplications** — tenant rental applications
- **ApplicationDocuments** — uploaded documents for applications
- **Rentals** — confirmed rental records
- **Favorites** — tenant favorite properties
- **Reviews** — tenant reviews post-rental
- **Notifications** — system notifications from Kafka events

---

## 7. API Overview

### Base URL
All requests go through the API Gateway: `http://localhost:8080/api`

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | /auth/register | Public |
| POST | /auth/login | Public |
| GET | /users/me | Authenticated |
| PUT | /users/me | Authenticated |
| GET | /users | Admin |
| GET | /users/pending-landlords | Admin |
| PUT | /users/{id}/approve-landlord | Admin |
| PUT | /users/{id}/reject-landlord | Admin |
| PUT | /users/{id}/activate | Admin |
| PUT | /users/{id}/deactivate | Admin |

### Properties
| Method | Endpoint | Access |
|---|---|---|
| GET | /properties | Public |
| GET | /properties/{id} | Public |
| GET | /properties/search | Public |
| GET | /properties/my | Landlord |
| POST | /properties | Landlord |
| PUT | /properties/{id} | Landlord |
| DELETE | /properties/{id} | Landlord |
| GET | /properties/pending | Admin |
| PUT | /properties/{id}/approve | Admin |
| PUT | /properties/{id}/reject | Admin |
| GET | /amenities | Public |
| POST | /amenities | Admin |

### Booking
| Method | Endpoint | Access |
|---|---|---|
| POST | /visits | Tenant |
| GET | /visits/my | Tenant |
| GET | /visits/landlord | Landlord |
| PUT | /visits/{id}/accept | Landlord |
| PUT | /visits/{id}/reject | Landlord |
| POST | /applications | Tenant |
| GET | /applications/my | Tenant |
| GET | /applications/landlord | Landlord |
| PUT | /applications/{id}/accept | Landlord |
| PUT | /applications/{id}/reject | Landlord |
| POST | /applications/{id}/documents | Tenant |
| GET | /rentals/my | Tenant |
| GET | /rentals/landlord | Landlord |

### Engagement
| Method | Endpoint | Access |
|---|---|---|
| POST | /favorites/{propertyId} | Tenant |
| DELETE | /favorites/{propertyId} | Tenant |
| GET | /favorites/my | Tenant |
| POST | /reviews | Tenant |
| GET | /properties/{id}/reviews | Public |
| GET | /reviews/my | Tenant |
| GET | /notifications/my | Authenticated |
| PUT | /notifications/{id}/read | Authenticated |
| PUT | /notifications/read-all | Authenticated |
| DELETE | /notifications/{id} | Authenticated |

---

## 8. Security Requirements

1. Passwords stored as BCrypt hashes (strength 12)
2. JWT tokens signed with HMAC-SHA256 using a 256+ bit secret
3. JWT contains: userId, email, role
4. JWT expiry: 24 hours
5. API Gateway validates JWT on all protected routes
6. Individual services also validate JWT independently
7. Role-based access enforced per endpoint
8. CORS restricted to known frontend origins

---

## 9. Use Cases (Summary)

| ID | Actor | Use Case |
|---|---|---|
| UC-1 | Tenant | Register account |
| UC-2 | Landlord | Register and await approval |
| UC-3 | Admin | Approve/reject landlord |
| UC-4 | Tenant/Public | Browse and search properties |
| UC-5 | Landlord | Create and manage properties |
| UC-6 | Admin | Approve/reject properties |
| UC-7 | Tenant | Request property visit |
| UC-8 | Landlord | Manage visit requests |
| UC-9 | Tenant | Submit rental application |
| UC-10 | Tenant | Upload application documents |
| UC-11 | Landlord | Accept/reject application |
| UC-12 | System | Create rental record on acceptance |
| UC-13 | Tenant | Add/remove favorites |
| UC-14 | Tenant | Write property review |
| UC-15 | User | View and manage notifications |
