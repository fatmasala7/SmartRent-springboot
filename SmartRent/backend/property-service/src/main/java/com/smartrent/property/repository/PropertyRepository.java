package com.smartrent.property.repository;

import com.smartrent.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Integer> {

    // Public: approved + active
    List<Property> findByIsApprovedTrueAndIsActiveTrue();

    // Landlord's own
    List<Property> findByLandlordID(Integer landlordId);

    // Admin: pending approval
    List<Property> findByIsApprovedFalseAndIsActiveTrue();

    // Search with filters
    @Query("SELECT p FROM Property p WHERE p.isApproved = true AND p.isActive = true " +
           "AND (:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:type IS NULL OR p.propertyType = :type) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Property> search(@Param("location") String location,
                          @Param("type") String type,
                          @Param("minPrice") java.math.BigDecimal minPrice,
                          @Param("maxPrice") java.math.BigDecimal maxPrice);
}
