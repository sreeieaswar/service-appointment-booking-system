package com.servicebooking.service_booking.repository;

import com.servicebooking.service_booking.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {

    Optional<ServiceCategory> findByName(String name);

    boolean existsByName(String name);
}
