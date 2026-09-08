package com.servicebooking.service_booking.dto;

import com.servicebooking.service_booking.entity.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {

    private Long id;

    private Long customerId;
    private String customerName;

    private Long serviceId;
    private String serviceName;

    private Long staffId;
    private String staffName;

    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String serviceAddress;
    private String customerInstructions;

    private AppointmentStatus status;

    private BigDecimal estimatedPrice;
    private BigDecimal finalServiceCharge;

    private String staffNotes;

    private LocalDateTime bookingDate;
}