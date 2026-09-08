package com.servicebooking.service_booking.service;

import com.servicebooking.service_booking.dto.ServiceRequest;
import com.servicebooking.service_booking.dto.ServiceResponse;
import com.servicebooking.service_booking.entity.Service;
import com.servicebooking.service_booking.repository.ServiceRepo;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepo serviceRepo;

    public ServiceService(ServiceRepo serviceRepo) {
        this.serviceRepo = serviceRepo;
    }

    public ServiceResponse createService(ServiceRequest request) {

        Service service = new Service();

        service.setServiceName(request.getServiceName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setEstimatedDuration(request.getEstimatedDuration());
        service.setCategory(request.getCategory());
        service.setActive(true);

        Service savedService = serviceRepo.save(service);

        return convertToResponse(savedService);
    }

    public List<ServiceResponse> getAllServices() {

        return serviceRepo.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ServiceResponse getServiceById(Long id) {

        Service service = serviceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        return convertToResponse(service);
    }

    private ServiceResponse convertToResponse(Service service) {

        return new ServiceResponse(
                service.getId(),
                service.getServiceName(),
                service.getDescription(),
                service.getPrice(),
                service.getEstimatedDuration(),
                service.getCategory(),
                service.getActive()
        );
    }

    public ServiceResponse updateService(Long id, ServiceRequest request) {

        Service service = serviceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setServiceName(request.getServiceName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setEstimatedDuration(request.getEstimatedDuration());
        service.setCategory(request.getCategory());

        Service updatedService = serviceRepo.save(service);

        return convertToResponse(updatedService);
    }

    public void deactivateService(Long id) {

        Service service = serviceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setActive(false);

        serviceRepo.save(service);
    }
}
