package com.servicebooking.service_booking.service;

import com.servicebooking.service_booking.dto.AppointmentRequest;
import com.servicebooking.service_booking.dto.AppointmentResponse;
import com.servicebooking.service_booking.dto.StaffAppointmentUpdateRequest;
import com.servicebooking.service_booking.entity.*;
import com.servicebooking.service_booking.repository.AppointmentRepository;
import com.servicebooking.service_booking.repository.ServiceRepo;
import com.servicebooking.service_booking.repository.StaffRepo;
import com.servicebooking.service_booking.repository.UserRepo;
import com.servicebooking.service_booking.entity.Service;
import com.servicebooking.service_booking.dto.RescheduleAppointmentRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@org.springframework.stereotype.Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepo userRepository;
    private final ServiceRepo serviceRepository;
    private final StaffRepo staffRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            UserRepo userRepository,
            ServiceRepo serviceRepository,
            StaffRepo staffRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.staffRepository = staffRepository;
    }

    public AppointmentResponse bookAppointment(AppointmentRequest request) {

        // Find customer
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Find service
        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Check whether service is active
        if (!service.getActive()) {
            throw new RuntimeException("Selected service is not active");
        }

        // Check date and time
        LocalDateTime appointmentDateTime =
                LocalDateTime.of(request.getAppointmentDate(), request.getStartTime());

        if (!appointmentDateTime.isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Appointment date and time must be in the future");
        }

        // Calculate end time using service duration
        LocalTime endTime = request.getStartTime()
                .plusMinutes(service.getEstimatedDuration());

        // Create appointment
        Appointment appointment = new Appointment();

        appointment.setCustomer(customer);
        appointment.setService(service);
        appointment.setStaff(null);

        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(endTime);

        appointment.setServiceAddress(request.getServiceAddress());
        appointment.setCustomerInstructions(request.getCustomerInstructions());

        appointment.setStatus(AppointmentStatus.PENDING);

        appointment.setEstimatedPrice(service.getPrice());

        appointment.setFinalServiceCharge(null);
        appointment.setStaffNotes(null);

        appointment.setBookingDate(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return convertToResponse(savedAppointment);
    }

    private AppointmentResponse convertToResponse(Appointment appointment) {

        AppointmentResponse response = new AppointmentResponse();

        response.setId(appointment.getId());

        response.setCustomerId(appointment.getCustomer().getId());
        response.setCustomerName(appointment.getCustomer().getName());

        response.setServiceId(appointment.getService().getId());
        response.setServiceName(appointment.getService().getServiceName());

        if (appointment.getStaff() != null) {
            response.setStaffId(appointment.getStaff().getId());
            response.setStaffName(
                    appointment.getStaff().getUser().getName()
            );
        }

        response.setAppointmentDate(appointment.getAppointmentDate());
        response.setStartTime(appointment.getStartTime());
        response.setEndTime(appointment.getEndTime());

        response.setServiceAddress(appointment.getServiceAddress());
        response.setCustomerInstructions(
                appointment.getCustomerInstructions()
        );

        response.setStatus(appointment.getStatus());

        response.setEstimatedPrice(appointment.getEstimatedPrice());
        response.setFinalServiceCharge(
                appointment.getFinalServiceCharge()
        );

        response.setStaffNotes(appointment.getStaffNotes());
        response.setBookingDate(appointment.getBookingDate());

        return response;
    }

    public AppointmentResponse getAppointmentById(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        return convertToResponse(appointment);
    }

    public List<AppointmentResponse> getAllAppointments() {

        List<Appointment> appointments =
                appointmentRepository.findAll();

        return appointments.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<AppointmentResponse> getCustomerAppointments(Long customerId) {

        List<Appointment> appointments =
                appointmentRepository.findByCustomerId(customerId);

        return appointments.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<AppointmentResponse> getStaffAppointments(Long staffId) {

        List<Appointment> appointments =
                appointmentRepository.findByStaffId(staffId);

        return appointments.stream()
                .map(this::convertToResponse)
                .toList();
    }
    public List<AppointmentResponse> getAppointmentsByDate(LocalDate appointmentDate) {

        List<Appointment> appointments =
                appointmentRepository.findByAppointmentDate(appointmentDate);

        return appointments.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<AppointmentResponse> getAppointmentsByStatus(
            AppointmentStatus status) {

        List<Appointment> appointments =
                appointmentRepository.findByStatus(status);

        return appointments.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public boolean isStaffAvailable(
            Long staffId,
            LocalDate appointmentDate,
            LocalTime startTime,
            LocalTime endTime) {

        boolean hasConflict =
                appointmentRepository
                        .existsByStaffIdAndAppointmentDateAndStartTimeLessThanAndEndTimeGreaterThan(
                                staffId,
                                appointmentDate,
                                endTime,
                                startTime
                        );

        return !hasConflict;
    }


    public AppointmentResponse assignStaff(
            Long appointmentId,
            Long staffId) {

        // Find appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Find staff
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // Check whether staff is available
        boolean available = isStaffAvailable(
                staffId,
                appointment.getAppointmentDate(),
                appointment.getStartTime(),
                appointment.getEndTime()
        );

        if (!available) {
            throw new RuntimeException(
                    "Staff is already booked for this time"
            );
        }

        // Assign staff
        appointment.setStaff(staff);

        // Change status to CONFIRMED
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        // Save appointment
        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return convertToResponse(updatedAppointment);
    }

    public AppointmentResponse updateAppointmentByStaff(
            Long appointmentId,
            Long staffId,
            StaffAppointmentUpdateRequest request) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Check whether this appointment is assigned to this staff
        if (appointment.getStaff() == null ||
                !appointment.getStaff().getId().equals(staffId)) {

            throw new RuntimeException(
                    "This appointment is not assigned to this staff"
            );
        }

        // Update appointment details
        appointment.setStatus(request.getStatus());
        appointment.setStaffNotes(request.getStaffNotes());
        appointment.setFinalServiceCharge(request.getFinalServiceCharge());

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return convertToResponse(updatedAppointment);
    }

    public AppointmentResponse cancelAppointment(Long appointmentId, Long customerId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Check whether this appointment belongs to the customer
        if (!appointment.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("This appointment does not belong to this customer");
        }

        // Check whether appointment is upcoming
        LocalDateTime appointmentDateTime =
                LocalDateTime.of(
                        appointment.getAppointmentDate(),
                        appointment.getStartTime()
                );

        if (!appointmentDateTime.isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Only upcoming appointments can be cancelled");
        }

        // Check whether already completed/cancelled/rejected
        if (appointment.getStatus() == AppointmentStatus.COMPLETED ||
                appointment.getStatus() == AppointmentStatus.CANCELLED ||
                appointment.getStatus() == AppointmentStatus.REJECTED) {

            throw new RuntimeException(
                    "This appointment cannot be cancelled"
            );
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return convertToResponse(updatedAppointment);
    }

    public AppointmentResponse rescheduleAppointment(
            Long appointmentId,
            Long customerId,
            RescheduleAppointmentRequest request) {

        // Find appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Check whether appointment belongs to customer
        if (!appointment.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException(
                    "This appointment does not belong to this customer"
            );
        }

        // Check whether appointment is already completed/cancelled/rejected
        if (appointment.getStatus() == AppointmentStatus.COMPLETED ||
                appointment.getStatus() == AppointmentStatus.CANCELLED ||
                appointment.getStatus() == AppointmentStatus.REJECTED) {

            throw new RuntimeException(
                    "This appointment cannot be rescheduled"
            );
        }

        // Create new appointment date and time
        LocalDateTime newAppointmentDateTime =
                LocalDateTime.of(
                        request.getAppointmentDate(),
                        request.getStartTime()
                );

        // Check whether new date/time is in the future
        if (!newAppointmentDateTime.isAfter(LocalDateTime.now())) {
            throw new RuntimeException(
                    "Appointment date and time must be in the future"
            );
        }

        // Calculate new end time using service duration
        LocalTime newEndTime =
                request.getStartTime()
                        .plusMinutes(
                                appointment.getService().getEstimatedDuration()
                        );

        // Update appointment
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(newEndTime);

        // Save appointment
        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return convertToResponse(updatedAppointment);
    }

    public AppointmentResponse updateAppointmentStatus(
            Long appointmentId,
            AppointmentStatus status) {

        Appointment appointment =
                appointmentRepository.findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Appointment not found"));

        // Admin can only confirm or reject
        if (status != AppointmentStatus.CONFIRMED &&
                status != AppointmentStatus.REJECTED) {

            throw new RuntimeException(
                    "Admin can only CONFIRM or REJECT an appointment"
            );
        }

        // Appointment must currently be pending
        if (appointment.getStatus() != AppointmentStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending appointments can be confirmed or rejected"
            );
        }

        appointment.setStatus(status);

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return convertToResponse(updatedAppointment);
    }

    public List<AppointmentResponse> filterAppointments(
            LocalDate appointmentDate,
            AppointmentStatus status) {

        List<Appointment> appointments;

        if (appointmentDate != null && status != null) {

            appointments = appointmentRepository
                    .findByAppointmentDateAndStatus(
                            appointmentDate,
                            status
                    );

        } else if (appointmentDate != null) {

            appointments = appointmentRepository
                    .findByAppointmentDate(appointmentDate);

        } else if (status != null) {

            appointments = appointmentRepository
                    .findByStatus(status);

        } else {

            appointments = appointmentRepository.findAll();
        }

        return appointments.stream()
                .map(this::convertToResponse)
                .toList();
    }

}