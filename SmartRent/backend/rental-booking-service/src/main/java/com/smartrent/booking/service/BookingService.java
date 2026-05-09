package com.smartrent.booking.service;

import com.smartrent.booking.dto.BookingDtos.*;
import com.smartrent.booking.entity.*;
import com.smartrent.booking.exception.AppException;
import com.smartrent.booking.kafka.BookingEvent;
import com.smartrent.booking.kafka.BookingEventProducer;
import com.smartrent.booking.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final VisitRequestRepository visitRepo;
    private final RentalApplicationRepository appRepo;
    private final RentalRepository rentalRepo;
    private final BookingEventProducer eventProducer;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${services.property.url:http://property-service:8082}")
    private String propertyServiceUrl;

    // ========= VISIT REQUESTS =========
    @Transactional
    public VisitRequestDto createVisit(Integer tenantId, CreateVisitRequest req) {
        if (req.getPropertyID() == null) throw new AppException("Property is required");
        Integer landlordId = resolveLandlordId(req.getPropertyID());

        VisitRequest v = VisitRequest.builder()
            .propertyID(req.getPropertyID())
            .tenantID(tenantId)
            .requestedDate(req.getRequestedDate())
            .message(req.getMessage())
            .status(VisitRequest.Status.Pending)
            .build();
        v = visitRepo.save(v);

        eventProducer.publish("booking-events", BookingEvent.of(
            "VisitRequestCreated", v.getPropertyID(), tenantId, landlordId,
            "A tenant has requested a visit to your property on " + v.getRequestedDate()
        ));
        return enrich(VisitRequestDto.from(v));
    }

    public List<VisitRequestDto> getMyVisits(Integer tenantId) {
        return visitRepo.findByTenantID(tenantId).stream()
            .map(VisitRequestDto::from).map(this::enrich).collect(Collectors.toList());
    }

    public List<VisitRequestDto> getLandlordVisits(Integer landlordId, List<Integer> propertyIds) {
        if (propertyIds == null || propertyIds.isEmpty()) return List.of();
        return visitRepo.findByPropertyIDIn(propertyIds).stream()
            .map(VisitRequestDto::from).map(this::enrich).collect(Collectors.toList());
    }

    @Transactional
    public VisitRequestDto acceptVisit(Integer visitId, Integer landlordId) {
        VisitRequest v = findVisit(visitId);
        v.setStatus(VisitRequest.Status.Accepted);
        v = visitRepo.save(v);

        eventProducer.publish("booking-events", BookingEvent.of(
            "VisitRequestAccepted", v.getPropertyID(), landlordId, v.getTenantID(),
            "Your visit request has been accepted!"
        ));
        return enrich(VisitRequestDto.from(v));
    }

    @Transactional
    public VisitRequestDto rejectVisit(Integer visitId, Integer landlordId) {
        VisitRequest v = findVisit(visitId);
        v.setStatus(VisitRequest.Status.Rejected);
        v = visitRepo.save(v);

        eventProducer.publish("booking-events", BookingEvent.of(
            "VisitRequestRejected", v.getPropertyID(), landlordId, v.getTenantID(),
            "Your visit request was rejected."
        ));
        return enrich(VisitRequestDto.from(v));
    }

    // ========= RENTAL APPLICATIONS =========
    @Transactional
    public ApplicationDto createApplication(Integer tenantId, String role, CreateApplicationRequest req) {
        requireRole(role, "Tenant", "Only tenants can submit rental applications");
        if (req.getPropertyID() == null) throw new AppException("Property is required");
        LocalDate startDate = req.getStartDate();
        if (startDate == null) throw new AppException("Move-in date is required");
        if (startDate.isBefore(LocalDate.now())) throw new AppException("Move-in date cannot be in the past");

        int months = req.getRentalDuration() == null || req.getRentalDuration() <= 0 ? 12 : req.getRentalDuration();
        LocalDate endDate = req.getEndDate() != null ? req.getEndDate() : startDate.plusMonths(months);
        Integer landlordId = resolveLandlordId(req.getPropertyID());

        RentalApplication app = RentalApplication.builder()
            .propertyID(req.getPropertyID())
            .tenantID(tenantId)
            .landlordID(landlordId)
            .startDate(startDate)
            .endDate(endDate)
            .jobTitle(req.getJobTitle())
            .monthlyIncome(req.getMonthlyIncome())
            .rentalDuration(months)
            .notes(req.getNotes())
            .status(RentalApplication.Status.Pending)
            .build();
        app = appRepo.save(app);

        eventProducer.publish("booking-events", BookingEvent.of(
            "RentalApplicationSubmitted", app.getPropertyID(), tenantId, landlordId,
            "A tenant submitted a rental application for your property."
        ));
        return enrich(ApplicationDto.from(app));
    }

    public List<ApplicationDto> getMyApplications(Integer tenantId) {
        return appRepo.findByTenantID(tenantId).stream()
            .map(ApplicationDto::from).map(this::enrich).collect(Collectors.toList());
    }

    public List<ApplicationDto> getLandlordApplications(Integer landlordId, String role, List<Integer> propertyIds) {
        requireAnyRole(role, "Landlord", "Admin");
        if (isRole(role, "Admin") && propertyIds != null && !propertyIds.isEmpty()) {
            return appRepo.findByPropertyIDIn(propertyIds).stream()
                .map(ApplicationDto::from).map(this::enrich).collect(Collectors.toList());
        }
        return appRepo.findByLandlordID(landlordId).stream()
            .map(ApplicationDto::from).map(this::enrich).collect(Collectors.toList());
    }

    public ApplicationDto getApplication(Integer appId) {
        return enrich(ApplicationDto.from(findApp(appId)));
    }

    @Transactional
    public ApplicationDto acceptApplication(Integer appId, Integer landlordId, String role) {
        requireLandlordOrAdminForApplication(appId, landlordId, role);
        RentalApplication app = findApp(appId);
        app.setStatus(RentalApplication.Status.Accepted);
        app = appRepo.save(app);

        // Create rental record
        long days = ChronoUnit.DAYS.between(app.getStartDate(), app.getEndDate());
        BigDecimal finalPrice = BigDecimal.valueOf(days * 100); // placeholder; real price from property

        Rental rental = Rental.builder()
            .applicationID(appId)
            .rentStartDate(app.getStartDate())
            .rentEndDate(app.getEndDate())
            .finalPrice(finalPrice)
            .build();
        rentalRepo.save(rental);

        // Notify tenant
        eventProducer.publish("booking-events", BookingEvent.of(
            "ApplicationAccepted", app.getPropertyID(), landlordId, app.getTenantID(),
            "Congratulations! Your rental application has been accepted."
        ));

        // Also publish to property-events so property-service updates rental status
        eventProducer.publish("booking-events", BookingEvent.of(
            "ApplicationAccepted", app.getPropertyID(), landlordId, app.getTenantID(),
            "ApplicationAccepted"
        ));

        eventProducer.publish("booking-events", BookingEvent.of(
            "RentalCreated", app.getPropertyID(), landlordId, app.getTenantID(),
            "A new rental has been created for your property."
        ));

        return enrich(ApplicationDto.from(app));
    }

    @Transactional
    public ApplicationDto rejectApplication(Integer appId, Integer landlordId, String role) {
        requireLandlordOrAdminForApplication(appId, landlordId, role);
        RentalApplication app = findApp(appId);
        app.setStatus(RentalApplication.Status.Rejected);
        app = appRepo.save(app);

        eventProducer.publish("booking-events", BookingEvent.of(
            "ApplicationRejected", app.getPropertyID(), landlordId, app.getTenantID(),
            "Your rental application was not approved."
        ));
        return enrich(ApplicationDto.from(app));
    }

    // ========= DOCUMENTS =========
    @Transactional
    public DocumentDto addDocument(Integer tenantId, Integer appId, AddDocumentRequest req) {
        RentalApplication app = findApp(appId);
        if (!app.getTenantID().equals(tenantId)) throw new AppException("Not your application");
        ApplicationDocument doc = ApplicationDocument.builder()
            .application(app).documentUrl(req.getDocumentUrl()).documentType(req.getDocumentType()).build();
        app.getDocuments().add(doc);
        appRepo.save(app);
        return DocumentDto.from(doc);
    }

    public List<DocumentDto> getDocuments(Integer appId) {
        return findApp(appId).getDocuments().stream().map(DocumentDto::from).collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse deleteDocument(Integer tenantId, Integer appId, Integer docId) {
        RentalApplication app = findApp(appId);
        if (!app.getTenantID().equals(tenantId)) throw new AppException("Not your application");
        app.getDocuments().removeIf(d -> d.getDocumentID().equals(docId));
        appRepo.save(app);
        return ApiResponse.ok("Document deleted");
    }

    // ========= RENTALS =========
    public List<RentalDto> getMyRentals(Integer tenantId) {
        return rentalRepo.findByTenantId(tenantId).stream().map(RentalDto::from).map(this::enrich).collect(Collectors.toList());
    }

    public List<RentalDto> getLandlordRentals(List<Integer> propertyIds) {
        if (propertyIds == null || propertyIds.isEmpty()) return List.of();
        return rentalRepo.findByPropertyIds(propertyIds).stream().map(RentalDto::from).map(this::enrich).collect(Collectors.toList());
    }

    public RentalDto getRental(Integer rentalId) {
        return enrich(RentalDto.from(rentalRepo.findById(rentalId)
            .orElseThrow(() -> new AppException("Rental not found"))));
    }

    private void requireLandlordOrAdminForApplication(Integer appId, Integer userId, String role) {
        requireAnyRole(role, "Landlord", "Admin");
        RentalApplication app = findApp(appId);
        if (isRole(role, "Landlord") && !userId.equals(app.getLandlordID())) {
            throw new AppException("Not your property's application");
        }
    }

    private void requireRole(String actual, String expected, String message) {
        if (!isRole(actual, expected)) throw new AppException(message);
    }

    private void requireAnyRole(String actual, String... expected) {
        for (String role : expected) if (isRole(actual, role)) return;
        throw new AppException("Not authorized");
    }

    private boolean isRole(String actual, String expected) {
        return actual != null && actual.equalsIgnoreCase(expected);
    }


    @SuppressWarnings("unchecked")
    private Map<String, Object> getPropertySummary(Integer propertyId) {
        if (propertyId == null) return Map.of();
        try {
            Map<String, Object> property = restTemplate.getForObject(propertyServiceUrl + "/api/properties/" + propertyId, Map.class);
            return property == null ? Map.of() : property;
        } catch (Exception e) {
            log.warn("Could not load property summary for {}: {}", propertyId, e.getMessage());
            return Map.of();
        }
    }

    private String asString(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value == null ? null : value.toString();
    }

    private BigDecimal asBigDecimal(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        try { return new BigDecimal(value.toString()); } catch (Exception e) { return null; }
    }

    @SuppressWarnings("unchecked")
    private String propertyImage(Map<String, Object> property) {
        Object main = property.get("mainImageUrl");
        if (main != null && !main.toString().isBlank()) return main.toString();
        Object imageUrl = property.get("imageUrl");
        if (imageUrl != null && !imageUrl.toString().isBlank()) return imageUrl.toString();
        Object images = property.get("images");
        if (images instanceof List<?> list && !list.isEmpty()) {
            for (Object item : list) {
                if (item instanceof Map<?,?> img && Boolean.TRUE.equals(img.get("isMain")) && img.get("imageUrl") != null) {
                    return img.get("imageUrl").toString();
                }
            }
            Object first = list.get(0);
            if (first instanceof Map<?,?> img && img.get("imageUrl") != null) return img.get("imageUrl").toString();
            if (first instanceof String str) return str;
        }
        return null;
    }


    private VisitRequestDto enrich(VisitRequestDto dto) {
        Map<String, Object> property = getPropertySummary(dto.getPropertyID());
        dto.setPropertyTitle(asString(property, "title"));
        dto.setPropertyLocation(asString(property, "location"));
        dto.setPropertyPrice(asBigDecimal(property, "price"));
        dto.setPropertyImageUrl(propertyImage(property));
        dto.setPropertyImage(dto.getPropertyImageUrl());
        return dto;
    }

    private ApplicationDto enrich(ApplicationDto dto) {
        Map<String, Object> property = getPropertySummary(dto.getPropertyID());
        dto.setPropertyTitle(asString(property, "title"));
        dto.setPropertyLocation(asString(property, "location"));
        dto.setPropertyPrice(asBigDecimal(property, "price"));
        dto.setPropertyImageUrl(propertyImage(property));
        dto.setPropertyImage(dto.getPropertyImageUrl());
        return dto;
    }

    private RentalDto enrich(RentalDto dto) {
        appRepo.findById(dto.getApplicationID()).ifPresent(app -> {
            dto.setPropertyID(app.getPropertyID());
            dto.setPropertyId(app.getPropertyID());
            Map<String, Object> property = getPropertySummary(app.getPropertyID());
            dto.setPropertyTitle(asString(property, "title"));
            dto.setPropertyLocation(asString(property, "location"));
            dto.setPropertyPrice(asBigDecimal(property, "price"));
            dto.setPropertyImageUrl(propertyImage(property));
            dto.setPropertyImage(dto.getPropertyImageUrl());
        });
        return dto;
    }

    @SuppressWarnings("unchecked")
    private Integer resolveLandlordId(Integer propertyId) {
        try {
            Map<String, Object> property = restTemplate.getForObject(propertyServiceUrl + "/api/properties/" + propertyId, Map.class);
            if (property == null || property.get("landlordID") == null) throw new AppException("Property not found");
            return ((Number) property.get("landlordID")).intValue();
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException("Could not verify property owner");
        }
    }

    private VisitRequest findVisit(Integer id) {
        return visitRepo.findById(id).orElseThrow(() -> new AppException("Visit request not found"));
    }
    private RentalApplication findApp(Integer id) {
        return appRepo.findById(id).orElseThrow(() -> new AppException("Application not found"));
    }
}
