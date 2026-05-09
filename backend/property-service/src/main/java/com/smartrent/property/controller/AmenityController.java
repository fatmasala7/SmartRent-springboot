package com.smartrent.property.controller;

import com.smartrent.property.dto.PropertyDtos.*;
import com.smartrent.property.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
public class AmenityController {

    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<AmenityDto>> getAll() {
        return ResponseEntity.ok(propertyService.getAllAmenities());
    }

    @PostMapping
    public ResponseEntity<AmenityDto> create(@RequestBody AmenityRequest req) {
        return ResponseEntity.ok(propertyService.createAmenity(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AmenityDto> update(@PathVariable Integer id,
                                             @RequestBody AmenityRequest req) {
        return ResponseEntity.ok(propertyService.updateAmenity(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Integer id) {
        return ResponseEntity.ok(propertyService.deleteAmenity(id));
    }
}
