package com.servicebooking.service_booking.repository;

import com.servicebooking.service_booking.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByAppointmentId(Long appointmentId);

    Optional<Review> findByAppointmentId(Long appointmentId);

    List<Review> findByAppointmentServiceId(Long serviceId);
}