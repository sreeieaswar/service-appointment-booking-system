package com.servicebooking.service_booking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignStaffRequest {

    @NotNull
    private Long staffId;
}