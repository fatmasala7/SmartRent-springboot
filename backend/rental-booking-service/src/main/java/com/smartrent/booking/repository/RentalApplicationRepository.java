package com.smartrent.booking.repository;

import com.smartrent.booking.entity.RentalApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RentalApplicationRepository extends JpaRepository<RentalApplication, Integer> {
    List<RentalApplication> findByTenantID(Integer tenantId);
    List<RentalApplication> findByPropertyIDIn(List<Integer> propertyIds);
    List<RentalApplication> findByLandlordID(Integer landlordId);
}
