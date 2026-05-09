# SmartRent - Corrected Project

## Run the project

From the project root:

```bash
docker compose down -v
docker compose up --build -d
docker compose ps
```

Open the frontend at:

```text
http://localhost:5173
```

All frontend API traffic is routed through the API Gateway:

```text
http://localhost:8080/api
```

Do not call the individual backend service ports from the frontend.

## Admin credentials

```text
Email: admin@smartrent.com
Password: Admin@123
```

## Testing flow - Admin

1. Log in as `admin@smartrent.com` / `Admin@123`.
2. Open the admin dashboard.
3. Approve pending landlords.
4. Approve pending properties.
5. Deactivate/reactivate users as needed. Deactivating a landlord publishes a user event and deactivates that landlord's properties in the property service.

## Testing flow - Landlord

1. Register or log in as a landlord.
2. Wait for admin approval if the landlord account is pending.
3. Open **View Profile** and confirm data is loaded from `GET /api/users/me`.
4. Open **Edit Profile** and update `fullName`, `phoneNumber`, `profileImage`, and `nationalOrPassportID` through `PUT /api/users/me`.
5. Add a property.
6. Delete/deactivate one of your own properties. The backend checks the authenticated landlord owns the property.
7. Open **Rental Applications**. The page calls `GET /api/applications/landlord` and shows only applications for properties owned by the logged-in landlord.
8. Accept or reject an application with:
   - `PUT /api/applications/{id}/accept`
   - `PUT /api/applications/{id}/reject`

## Testing flow - Tenant

1. Register or log in as a tenant.
2. Browse approved active properties from `GET /api/properties`.
3. Add a property to favorites using `POST /api/favorites/{propertyId}`.
4. Remove a property from favorites using `DELETE /api/favorites/{propertyId}`.
5. View favorites using `GET /api/favorites/my`.
6. Submit a rental application using the application modal. The form sends the move-in date as `YYYY-MM-DD` and does not call `toISOString()` on user input.
7. View submitted applications from `GET /api/applications/my`.

## Fixed endpoints

### User/profile

- `GET /api/users/me`
- `PUT /api/users/me`

### Rental applications

- `POST /api/applications`
- `GET /api/applications/my`
- `GET /api/applications/landlord`
- `PUT /api/applications/{id}/accept`
- `PUT /api/applications/{id}/reject`

### Properties

- `DELETE /api/properties/{id}` soft-deactivates the property.
- Landlords may deactivate only their own properties.
- Admins may deactivate any property.

### Favorites

- `POST /api/favorites/{propertyId}`
- `DELETE /api/favorites/{propertyId}`
- `GET /api/favorites/my`

### Reviews

- `GET /api/properties/{propertyId}/reviews`

The Gateway routes `/api/properties/*/reviews` to the engagement notification service before the generic `/api/properties/**` route.

## Gateway/header behavior

The API Gateway validates JWTs and forwards these identity headers to protected backend services:

```text
X-User-Id
X-User-Role
X-User-Email
```

Downstream services now trust those Gateway headers first and fall back to JWT parsing only when called directly with an Authorization header. Protected flows use the authenticated user identity instead of hardcoded user IDs.

## Notes on validation performed here

The frontend production build was validated successfully with:

```bash
npm --prefix frontend install
npm --prefix frontend run build
```

The execution environment used for this correction did not include Maven or Docker CLIs, so Java/Docker compilation could not be run inside the container. The included code changes are source-level fixes intended for the required Docker validation commands above.


## Eureka Service Registry

This version includes a new `eureka-server` microservice running on port `8761`.
All backend microservices and the API Gateway register with Eureka using:

`http://eureka-server:8761/eureka/` inside Docker.

The API Gateway routes to services through Eureka using `lb://SERVICE-NAME` routes while the frontend still uses only:

`http://localhost:8080/api`

Eureka dashboard:

`http://localhost:8761`
