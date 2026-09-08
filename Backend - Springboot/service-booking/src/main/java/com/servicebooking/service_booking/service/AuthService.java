package com.servicebooking.service_booking.service;

import com.servicebooking.service_booking.dto.LoginRequest;
import com.servicebooking.service_booking.dto.LoginResponse;
import com.servicebooking.service_booking.dto.RegisterRequest;
import com.servicebooking.service_booking.dto.RegisterResponse;
import com.servicebooking.service_booking.entity.Role;
import com.servicebooking.service_booking.entity.User;
import com.servicebooking.service_booking.exception.EmailAlreadyExistsException;
import com.servicebooking.service_booking.exception.InvalidCredentialsException;
import com.servicebooking.service_booking.repository.UserRepo;
import com.servicebooking.service_booking.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtService jwtService;


    public RegisterResponse register(RegisterRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);
        user.setActive(true);

        User savedUser = userRepo.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.isActive()
        );
    }

    public LoginResponse login(LoginRequest request) {

        Optional<User> userOptional = userRepo.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                "Login successful",
                token,
                 user.getRole().name()
        );
    }




    }

