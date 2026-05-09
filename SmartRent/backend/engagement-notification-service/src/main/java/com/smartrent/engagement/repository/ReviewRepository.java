package com.smartrent.engagement.repository;

import com.smartrent.engagement.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByPropertyID(Integer propertyId);
    List<Review> findByTenantID(Integer tenantId);
}
