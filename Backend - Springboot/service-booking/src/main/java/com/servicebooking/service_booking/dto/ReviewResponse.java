package com.servicebooking.service_booking.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;

    private Long appointmentId;

    private Long customerId;

    private String customerName;

    private Long serviceId;

    private String serviceName;

    private Integer rating;

    private String comment;

    private LocalDateTime createdAt;
}