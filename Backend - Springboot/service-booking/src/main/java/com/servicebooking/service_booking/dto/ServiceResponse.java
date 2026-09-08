package com.servicebooking.service_booking.dto;

import java.math.BigDecimal;

public class ServiceResponse {

    private Long id;
    private String serviceName;
    private String description;
    private BigDecimal price;
    private Integer estimatedDuration;
    private String category;
    private Boolean active;

    public ServiceResponse() {
    }

    public ServiceResponse(Long id, String serviceName, String description,
                           BigDecimal price, Integer estimatedDuration,
                           String category, Boolean active) {
        this.id = id;
        this.serviceName = serviceName;
        this.description = description;
        this.price = price;
        this.estimatedDuration = estimatedDuration;
        this.category = category;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getEstimatedDuration() {
        return estimatedDuration;
    }

    public String getCategory() {
        return category;
    }

    public Boolean getActive() {
        return active;
    }
}