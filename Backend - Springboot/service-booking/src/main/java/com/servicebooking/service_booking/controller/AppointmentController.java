package com.servicebooking.service_booking.controller;

import com.servicebooking.service_booking.dto.*;
import com.servicebooking.service_booking.entity.AppointmentStatus;
import com.servicebooking.service_booking.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @Valid @RequestBody AppointmentRequest request) {

        AppointmentResponse response =
                appointmentService.bookAppointment(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(
            @PathVariable Long id) {

        AppointmentResponse response =
                appointmentService.getAppointmentById(id);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {

        List<AppointmentResponse> appointments =
                appointmentService.getAllAppointments();

        return ResponseEntity.ok(appointments);
    }



    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<AppointmentResponse>> getCustomerAppointments(
            @PathVariable Long customerId) {

        List<AppointmentResponse> appointments =
                appointmentService.getCustomerAppointments(customerId);

        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<AppointmentResponse>> getStaffAppointments(
            @PathVariable Long staffId) {

        List<AppointmentResponse> appointments =
                appointmentService.getStaffAppointments(staffId);

        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/date/{appointmentDate}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDate(
            @PathVariable LocalDate appointmentDate) {

        List<AppointmentResponse> appointments =
                appointmentService.getAppointmentsByDate(appointmentDate);

        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByStatus(
            @PathVariable AppointmentStatus status) {

        List<AppointmentResponse> appointments =
                appointmentService.getAppointmentsByStatus(status);

        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{appointmentId}/assign-staff")
    public ResponseEntity<AppointmentResponse> assignStaff(
            @PathVariable Long appointmentId,
            @RequestBody AssignStaffRequest request) {

        AppointmentResponse response =
                appointmentService.assignStaff(
                        appointmentId,
                        request.getStaffId()
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{appointmentId}/staff-update/{staffId}")
    public ResponseEntity<AppointmentResponse> updateAppointmentByStaff(
            @PathVariable Long appointmentId,
            @PathVariable Long staffId,
            @Valid @RequestBody StaffAppointmentUpdateRequest request) {

        AppointmentResponse response =
                appointmentService.updateAppointmentByStaff(
                        appointmentId,
                        staffId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{appointmentId}/cancel/{customerId}")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            @PathVariable Long appointmentId,
            @PathVariable Long customerId) {

        AppointmentResponse response =
                appointmentService.cancelAppointment(
                        appointmentId,
                        customerId
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{appointmentId}/reschedule/{customerId}")
    public ResponseEntity<AppointmentResponse> rescheduleAppointment(
            @PathVariable Long appointmentId,
            @PathVariable Long customerId,
            @Valid @RequestBody RescheduleAppointmentRequest request) {

        AppointmentResponse response =
                appointmentService.rescheduleAppointment(
                        appointmentId,
                        customerId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @Valid @RequestBody UpdateAppointmentStatusRequest request) {

        AppointmentResponse response =
                appointmentService.updateAppointmentStatus(
                        appointmentId,
                        request.getStatus()
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<AppointmentResponse>> filterAppointments(
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) AppointmentStatus status) {

        List<AppointmentResponse> appointments =
                appointmentService.filterAppointments(date, status);

        return ResponseEntity.ok(appointments);
    }
}
