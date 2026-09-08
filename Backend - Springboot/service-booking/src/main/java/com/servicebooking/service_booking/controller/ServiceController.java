package com.servicebooking.service_booking.controller;

import com.servicebooking.service_booking.dto.ServiceRequest;
import com.servicebooking.service_booking.dto.ServiceResponse;
import com.servicebooking.service_booking.service.ServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @PostMapping
    public ResponseEntity<ServiceResponse> createService(
            @RequestBody ServiceRequest request) {

        return ResponseEntity.ok(serviceService.createService(request));
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAllServices() {

        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getServiceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable Long id,
            @RequestBody ServiceRequest request) {

        return ResponseEntity.ok(serviceService.updateService(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deactivateService(
            @PathVariable Long id) {

        serviceService.deactivateService(id);

        return ResponseEntity.ok("Service deactivated successfully");
    }
}
