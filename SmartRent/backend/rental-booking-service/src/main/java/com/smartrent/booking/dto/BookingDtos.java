package com.smartrent.booking.dto;

import com.smartrent.booking.entity.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonAlias;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BookingDtos {

    @Data public static class CreateVisitRequest {
        @JsonAlias({"propertyId", "propertyID"})
        @NotNull private Integer propertyID;
        @NotNull private LocalDateTime requestedDate;
        private String message;
    }

    @Data public static class VisitRequestDto {
        private Integer requestID;
        private Integer propertyID;
        private Integer propertyId;
        private Integer tenantID;
        private String propertyTitle;
        private String propertyLocation;
        private BigDecimal propertyPrice;
        private String propertyImageUrl;
        private String propertyImage;
        private LocalDateTime requestedDate;
        private String time;
        private String message;
        private String notes;
        private String status;
        private LocalDateTime createdAt;

        public static VisitRequestDto from(VisitRequest v) {
            VisitRequestDto d = new VisitRequestDto();
            d.requestID = v.getRequestID();
            d.propertyID = v.getPropertyID();
            d.propertyId = v.getPropertyID();
            d.tenantID = v.getTenantID();
            d.requestedDate = v.getRequestedDate();
            d.time = v.getRequestedDate() == null ? null : v.getRequestedDate().toLocalTime().toString();
            d.message = v.getMessage();
            d.notes = v.getMessage();
            d.status = v.getStatus().name();
            d.createdAt = v.getCreatedAt();
            return d;
        }
    }

    @Data public static class CreateApplicationRequest {
        @JsonAlias({"propertyId", "propertyID"})
        @NotNull private Integer propertyID;
        @JsonAlias({"moveInDate", "startDate"})
        private LocalDate startDate;
        private LocalDate endDate;
        private String jobTitle;
        private BigDecimal monthlyIncome;
        @JsonAlias({"rentalDuration", "duration"})
        private Integer rentalDuration;
        private String notes;
    }

    @Data public static class ApplicationDto {
        private Integer applicationID;
        private Integer propertyID;
        private Integer propertyId;
        private Integer tenantID;
        private String propertyTitle;
        private String propertyLocation;
        private BigDecimal propertyPrice;
        private String propertyImageUrl;
        private String propertyImage;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
        private String jobTitle;
        private BigDecimal monthlyIncome;
        private Integer rentalDuration;
        private String notes;
        private LocalDate moveInDate;
        private LocalDateTime createdAt;
        private List<DocumentDto> documents;

        public static ApplicationDto from(RentalApplication a) {
            ApplicationDto d = new ApplicationDto();
            d.applicationID = a.getApplicationID(); d.propertyID = a.getPropertyID(); d.propertyId = a.getPropertyID();
            d.tenantID = a.getTenantID(); d.startDate = a.getStartDate();
            d.endDate = a.getEndDate(); d.status = a.getStatus().name();
            d.jobTitle = a.getJobTitle(); d.monthlyIncome = a.getMonthlyIncome();
            d.rentalDuration = a.getRentalDuration(); d.notes = a.getNotes();
            d.moveInDate = a.getStartDate(); d.createdAt = a.getCreatedAt();
            d.documents = a.getDocuments() == null ? List.of() : a.getDocuments().stream().map(DocumentDto::from).collect(Collectors.toList());
            return d;
        }
    }

    @Data public static class AddDocumentRequest {
        @NotNull private String documentUrl;
        private String documentType;
    }

    @Data public static class DocumentDto {
        private Integer documentID;
        private String documentType;
        private String documentUrl;

        public static DocumentDto from(ApplicationDocument doc) {
            DocumentDto d = new DocumentDto();
            d.documentID = doc.getDocumentID(); d.documentType = doc.getDocumentType();
            d.documentUrl = doc.getDocumentUrl(); return d;
        }
    }

    @Data public static class RentalDto {
        private Integer rentalID;
        private Integer id;
        private Integer applicationID;
        private Integer propertyID;
        private Integer propertyId;
        private String propertyTitle;
        private String propertyLocation;
        private BigDecimal propertyPrice;
        private String propertyImageUrl;
        private String propertyImage;
        private String status;
        private LocalDate rentStartDate;
        private LocalDate rentEndDate;
        private BigDecimal finalPrice;
        private LocalDateTime createdAt;

        // Explicit getters/setters for both propertyID and propertyId because this class keeps
        // both legacy and camelCase fields for frontend/backend compatibility.
        // Some Lombok/JavaBeans combinations can skip/conflict when both names exist.
        public Integer getPropertyID() {
            return propertyID;
        }

        public void setPropertyID(Integer propertyID) {
            this.propertyID = propertyID;
        }

        public Integer getPropertyId() {
            return propertyId;
        }

        public void setPropertyId(Integer propertyId) {
            this.propertyId = propertyId;
        }

        public static RentalDto from(Rental r) {
            RentalDto d = new RentalDto();
            d.rentalID = r.getRentalID(); d.id = r.getRentalID(); d.applicationID = r.getApplicationID();
            d.rentStartDate = r.getRentStartDate(); d.rentEndDate = r.getRentEndDate();
            d.status = r.getRentEndDate() != null && r.getRentEndDate().isBefore(LocalDate.now()) ? "Expired" : "Active";
            d.finalPrice = r.getFinalPrice(); d.createdAt = r.getCreatedAt(); return d;
        }
    }

    @Data public static class ApiResponse {
        private boolean success; private String message; private Object data;
        public static ApiResponse ok(String m) { ApiResponse r = new ApiResponse(); r.success=true; r.message=m; return r; }
        public static ApiResponse ok(String m, Object d) { ApiResponse r=ok(m); r.data=d; return r; }
    }
}
