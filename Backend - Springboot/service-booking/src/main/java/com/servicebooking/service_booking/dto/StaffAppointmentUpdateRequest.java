package com.servicebooking.service_booking.dto;

import com.servicebooking.service_booking.entity.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffAppointmentUpdateRequest {

    private AppointmentStatus status;

    private String staffNotes;

    private BigDecimal finalServiceCharge;
}
