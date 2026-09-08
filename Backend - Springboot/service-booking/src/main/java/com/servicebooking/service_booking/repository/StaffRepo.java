package com.servicebooking.service_booking.repository;

import com.servicebooking.service_booking.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffRepo extends JpaRepository<Staff, Long> {

    List<Staff> findAllByUser_Role(com.servicebooking.service_booking.entity.Role role);
}
