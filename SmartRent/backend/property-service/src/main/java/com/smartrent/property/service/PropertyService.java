package com.smartrent.property.service;

import com.smartrent.property.dto.PropertyDtos.*;
import com.smartrent.property.entity.Amenity;
import com.smartrent.property.entity.Property;
import com.smartrent.property.entity.PropertyImage;
import com.smartrent.property.exception.AppException;
import com.smartrent.property.kafka.PropertyEvent;
import com.smartrent.property.kafka.PropertyKafkaHandler;
import com.smartrent.property.repository.AmenityRepository;
import com.smartrent.property.repository.PropertyImageRepository;
import com.smartrent.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepo;
    private final AmenityRepository amenityRepo;
    private final PropertyImageRepository imageRepo;
    private final PropertyKafkaHandler kafkaHandler;

    public List<PropertyDto> getAllApproved() {
        return propertyRepo.findByIsApprovedTrueAndIsActiveTrue()
            .stream().map(PropertyDto::from).collect(Collectors.toList());
    }

    public PropertyDto getById(Integer id) {
        return PropertyDto.from(findProperty(id));
    }

    public List<PropertyDto> search(String location, String type, BigDecimal minPrice, BigDecimal maxPrice) {
        return propertyRepo.search(location, type, minPrice, maxPrice)
            .stream().map(PropertyDto::from).collect(Collectors.toList());
    }

    public List<PropertyDto> getMyProperties(Integer landlordId) {
        return propertyRepo.findByLandlordID(landlordId)
            .stream().map(PropertyDto::from).collect(Collectors.toList());
    }

    public List<PropertyDto> getPendingProperties() {
        return propertyRepo.findByIsApprovedFalseAndIsActiveTrue()
            .stream().map(PropertyDto::from).collect(Collectors.toList());
    }

    @Transactional
    public PropertyDto createProperty(Integer landlordId, CreatePropertyRequest req) {
        Property p = Property.builder()
            .landlordID(landlordId)
            .title(req.getTitle())
            .description(req.getDescription())
            .price(req.getPrice())
            .location(req.getLocation())
            .propertyType(req.getPropertyType())
            .isApproved(false)
            .isActive(true)
            .rentalStatus(Property.RentalStatus.Available)
            .build();

        p = propertyRepo.save(p);

        kafkaHandler.publish("property-events", PropertyEvent.of(
            "PropertySubmitted", p.getPropertyID(), landlordId, null,
            "New property submitted for review: " + p.getTitle()
        ));

        return PropertyDto.from(p);
    }

    @Transactional
    public PropertyDto updateProperty(Integer landlordId, Integer propertyId, UpdatePropertyRequest req) {
        Property p = findProperty(propertyId);
        if (!p.getLandlordID().equals(landlordId)) throw new AppException("Not your property");
        if (req.getTitle() != null) p.setTitle(req.getTitle());
        if (req.getDescription() != null) p.setDescription(req.getDescription());
        if (req.getPrice() != null) p.setPrice(req.getPrice());
        if (req.getLocation() != null) p.setLocation(req.getLocation());
        if (req.getPropertyType() != null) p.setPropertyType(req.getPropertyType());
        if (req.getIsActive() != null) p.setIsActive(req.getIsActive());
        return PropertyDto.from(propertyRepo.save(p));
    }

    @Transactional
    public ApiResponse deleteProperty(Integer userId, String role, Integer propertyId) {
        boolean isAdmin = role != null && role.equalsIgnoreCase("Admin");
        boolean isLandlord = role != null && role.equalsIgnoreCase("Landlord");
        if (!isAdmin && !isLandlord) throw new AppException("Only landlords or admins can deactivate properties");
        Property p = findProperty(propertyId);
        if (isLandlord && !p.getLandlordID().equals(userId)) {
            throw new AppException("Not your property");
        }
        p.setIsActive(false);
        propertyRepo.save(p);
        return ApiResponse.ok("Property deactivated successfully");
    }

    @Transactional
    public PropertyDto approveProperty(Integer propertyId, Integer adminId) {
        Property p = findProperty(propertyId);
        p.setIsApproved(true);
        p.setApprovedByAdminID(adminId);
        p = propertyRepo.save(p);

        kafkaHandler.publish("property-events", PropertyEvent.of(
            "PropertyApproved", propertyId, adminId, p.getLandlordID(),
            "Your property \"" + p.getTitle() + "\" has been approved!"
        ));
        return PropertyDto.from(p);
    }

    @Transactional
    public PropertyDto rejectProperty(Integer propertyId, Integer adminId) {
        Property p = findProperty(propertyId);
        p.setIsActive(false);
        p = propertyRepo.save(p);

        kafkaHandler.publish("property-events", PropertyEvent.of(
            "PropertyRejected", propertyId, adminId, p.getLandlordID(),
            "Your property \"" + p.getTitle() + "\" was rejected."
        ));
        return PropertyDto.from(p);
    }

    @Transactional
    public ImageDto addImage(Integer landlordId, Integer propertyId, ImageRequest req) {
        Property p = findProperty(propertyId);
        if (!p.getLandlordID().equals(landlordId)) throw new AppException("Not your property");
        if (req.getImageUrl() == null || req.getImageUrl().trim().isEmpty()) {
            throw new AppException("Image URL is required");
        }
        if (req.getImageUrl().length() > 500) {
            throw new AppException("Image URL is too long. Please use a shorter URL.");
        }

        boolean makeMain = Boolean.TRUE.equals(req.getIsMain())
            || imageRepo.findByProperty_PropertyID(propertyId).isEmpty();
        if (makeMain) {
            imageRepo.findByProperty_PropertyID(propertyId).forEach(existing -> {
                existing.setIsMain(false);
                imageRepo.save(existing);
            });
        }

        PropertyImage img = PropertyImage.builder()
            .property(p)
            .imageUrl(req.getImageUrl().trim())
            .isMain(makeMain)
            .build();
        return ImageDto.from(imageRepo.save(img));
    }

    @Transactional
    public ApiResponse deleteImage(Integer landlordId, Integer propertyId, Integer imageId) {
        Property p = findProperty(propertyId);
        if (!p.getLandlordID().equals(landlordId)) throw new AppException("Not your property");
        imageRepo.deleteById(imageId);
        return ApiResponse.ok("Image deleted");
    }

    @Transactional
    public ApiResponse addAmenity(Integer landlordId, Integer propertyId, Integer amenityId) {
        Property p = findProperty(propertyId);
        if (!p.getLandlordID().equals(landlordId)) throw new AppException("Not your property");
        Amenity a = amenityRepo.findById(amenityId).orElseThrow(() -> new AppException("Amenity not found"));
        p.getAmenities().add(a);
        propertyRepo.save(p);
        return ApiResponse.ok("Amenity added");
    }

    @Transactional
    public ApiResponse removeAmenity(Integer landlordId, Integer propertyId, Integer amenityId) {
        Property p = findProperty(propertyId);
        if (!p.getLandlordID().equals(landlordId)) throw new AppException("Not your property");
        p.getAmenities().removeIf(a -> a.getAmenityID().equals(amenityId));
        propertyRepo.save(p);
        return ApiResponse.ok("Amenity removed");
    }

    // Amenity CRUD (Admin)
    public List<AmenityDto> getAllAmenities() {
        return amenityRepo.findAll().stream().map(AmenityDto::from).collect(Collectors.toList());
    }

    @Transactional
    public AmenityDto createAmenity(AmenityRequest req) {
        Amenity a = Amenity.builder().amenityName(req.getAmenityName()).build();
        return AmenityDto.from(amenityRepo.save(a));
    }

    @Transactional
    public AmenityDto updateAmenity(Integer id, AmenityRequest req) {
        Amenity a = amenityRepo.findById(id).orElseThrow(() -> new AppException("Amenity not found"));
        a.setAmenityName(req.getAmenityName());
        return AmenityDto.from(amenityRepo.save(a));
    }

    @Transactional
    public ApiResponse deleteAmenity(Integer id) {
        amenityRepo.deleteById(id);
        return ApiResponse.ok("Amenity deleted");
    }

    private Property findProperty(Integer id) {
        return propertyRepo.findById(id).orElseThrow(() -> new AppException("Property not found"));
    }
}
