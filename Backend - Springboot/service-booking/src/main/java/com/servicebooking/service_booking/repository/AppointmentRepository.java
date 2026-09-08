package com.servicebooking.service_booking.repository;

import com.servicebooking.service_booking.entity.Appointment;
import com.servicebooking.service_booking.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByCustomerId(Long customerId);

    List<Appointment> findByStaffId(Long staffId);

    List<Appointment> findByAppointmentDate(LocalDate appointmentDate);

    List<Appointment> findByStatus(AppointmentStatus status);

    List<Appointment> findByAppointmentDateAndStatus(
            LocalDate appointmentDate,
            AppointmentStatus status
    );



    boolean existsByStaffIdAndAppointmentDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Long staffId,
            LocalDate appointmentDate,
            LocalTime endTime,
            LocalTime startTime
    );
}
