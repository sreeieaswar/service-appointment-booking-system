package com.servicebooking.service_booking.dto;

import com.servicebooking.service_booking.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean active;

    public RegisterResponse() {
    }

    public RegisterResponse(Long id, String name, String email, Role role, boolean active) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.active = active;
    }
}
