package com.smartrent.engagement.repository;

import com.smartrent.engagement.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    List<Favorite> findByTenantID(Integer tenantId);
    Optional<Favorite> findByTenantIDAndPropertyID(Integer tenantId, Integer propertyId);
    boolean existsByTenantIDAndPropertyID(Integer tenantId, Integer propertyId);
}
