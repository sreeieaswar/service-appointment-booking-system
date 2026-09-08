package com.servicebooking.service_booking.repository;

import com.servicebooking.service_booking.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepo extends JpaRepository<Service, Long> {
}
