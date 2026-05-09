package com.smartrent.booking.repository;

import com.smartrent.booking.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Integer> {

    @Query("SELECT r FROM Rental r WHERE r.applicationID IN " +
           "(SELECT a.applicationID FROM RentalApplication a WHERE a.tenantID = :tenantId)")
    List<Rental> findByTenantId(@Param("tenantId") Integer tenantId);

    @Query("SELECT r FROM Rental r WHERE r.applicationID IN " +
           "(SELECT a.applicationID FROM RentalApplication a WHERE a.propertyID IN :propertyIds)")
    List<Rental> findByPropertyIds(@Param("propertyIds") List<Integer> propertyIds);
}
