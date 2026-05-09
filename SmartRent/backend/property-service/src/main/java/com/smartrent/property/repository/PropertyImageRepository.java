package com.smartrent.property.repository;

import com.smartrent.property.entity.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Integer> {
    List<PropertyImage> findByProperty_PropertyID(Integer propertyID);
}
