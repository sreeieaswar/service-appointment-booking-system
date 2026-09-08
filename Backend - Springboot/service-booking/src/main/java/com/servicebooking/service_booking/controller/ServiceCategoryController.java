package com.servicebooking.service_booking.controller;

import com.servicebooking.service_booking.dto.ServiceCategoryRequest;
import com.servicebooking.service_booking.dto.ServiceCategoryResponse;
import com.servicebooking.service_booking.service.ServiceCategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class ServiceCategoryController {

    private final ServiceCategoryService categoryService;

    public ServiceCategoryController(ServiceCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceCategoryResponse create(
            @Valid @RequestBody ServiceCategoryRequest request) {

        return categoryService.create(request);
    }

    @GetMapping
    public List<ServiceCategoryResponse> getAll() {

        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public ServiceCategoryResponse getById(@PathVariable Long id) {

        return categoryService.getById(id);
    }

    @PutMapping("/{id}")
    public ServiceCategoryResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ServiceCategoryRequest request) {

        return categoryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivate(@PathVariable Long id) {

        categoryService.deactivate(id);
    }
}