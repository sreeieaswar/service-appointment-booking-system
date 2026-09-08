package com.servicebooking.service_booking.controller;

import com.servicebooking.service_booking.dto.LoginRequest;
import com.servicebooking.service_booking.dto.LoginResponse;
import com.servicebooking.service_booking.dto.RegisterRequest;
import com.servicebooking.service_booking.dto.RegisterResponse;
import com.servicebooking.service_booking.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {


    AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/register")
    public RegisterResponse register(@Valid@RequestBody RegisterRequest request){
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
