package com.servicebooking.service_booking.service;

import com.servicebooking.service_booking.dto.ServiceCategoryRequest;
import com.servicebooking.service_booking.dto.ServiceCategoryResponse;
import com.servicebooking.service_booking.entity.ServiceCategory;
import com.servicebooking.service_booking.repository.ServiceCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceCategoryService {

    private final ServiceCategoryRepository categoryRepository;

    public ServiceCategoryService(ServiceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public ServiceCategoryResponse create(ServiceCategoryRequest request) {

        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists");
        }

        ServiceCategory category = new ServiceCategory();

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setActive(true);

        ServiceCategory saved = categoryRepository.save(category);

        return mapToResponse(saved);
    }

    public List<ServiceCategoryResponse> getAll() {

        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ServiceCategoryResponse getById(Long id) {

        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return mapToResponse(category);
    }

    public ServiceCategoryResponse update(Long id, ServiceCategoryRequest request) {

        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        ServiceCategory updated = categoryRepository.save(category);

        return mapToResponse(updated);
    }

    public void deactivate(Long id) {

        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setActive(false);

        categoryRepository.save(category);
    }

    private ServiceCategoryResponse mapToResponse(ServiceCategory category) {

        return new ServiceCategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.isActive()
        );
    }
}
