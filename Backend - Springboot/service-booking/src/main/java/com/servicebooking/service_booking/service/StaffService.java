package com.servicebooking.service_booking.service;

import com.servicebooking.service_booking.dto.StaffRequest;
import com.servicebooking.service_booking.dto.StaffResponse;
import com.servicebooking.service_booking.entity.Role;
import com.servicebooking.service_booking.entity.Staff;
import com.servicebooking.service_booking.entity.User;
import com.servicebooking.service_booking.repository.StaffRepo;
import com.servicebooking.service_booking.repository.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@org.springframework.stereotype.Service
public class StaffService {

    private final StaffRepo staffRepo;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public StaffService(StaffRepo staffRepo,
                        UserRepo userRepo,
                        PasswordEncoder passwordEncoder) {
        this.staffRepo = staffRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public StaffResponse createStaff(StaffRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STAFF);
        user.setActive(true);

        User savedUser = userRepo.save(user);

        Staff staff = new Staff();
        staff.setUser(savedUser);
        staff.setSkills(request.getSkills());
        staff.setExperience(request.getExperience());

        Staff savedStaff = staffRepo.save(staff);

        return convertToResponse(savedStaff);
    }

    public List<StaffResponse> getAllStaff() {

        return staffRepo.findAllByUser_Role(Role.STAFF)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public StaffResponse getStaffById(Long id) {

        Staff staff = staffRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        return convertToResponse(staff);
    }

    public StaffResponse updateStaff(Long id, StaffRequest request) {

        Staff staff = staffRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        User user = staff.getUser();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        staff.setSkills(request.getSkills());
        staff.setExperience(request.getExperience());

        userRepo.save(user);
        Staff updatedStaff = staffRepo.save(staff);

        return convertToResponse(updatedStaff);
    }

    public void deactivateStaff(Long id) {

        Staff staff = staffRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        User user = staff.getUser();
        user.setActive(false);

        userRepo.save(user);
    }

    private StaffResponse convertToResponse(Staff staff) {

        User user = staff.getUser();

        return new StaffResponse(
                staff.getId(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                staff.getSkills(),
                staff.getExperience(),
                user.isActive()
        );
    }
}