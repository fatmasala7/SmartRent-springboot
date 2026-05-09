package com.smartrent.booking.repository;

import com.smartrent.booking.entity.VisitRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VisitRequestRepository extends JpaRepository<VisitRequest, Integer> {
    List<VisitRequest> findByTenantID(Integer tenantId);
    List<VisitRequest> findByPropertyIDIn(List<Integer> propertyIds);
}
