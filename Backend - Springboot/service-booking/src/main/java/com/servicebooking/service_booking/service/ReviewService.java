package com.servicebooking.service_booking.service;

import com.servicebooking.service_booking.dto.ReviewRequest;
import com.servicebooking.service_booking.dto.ReviewResponse;
import com.servicebooking.service_booking.entity.Appointment;
import com.servicebooking.service_booking.entity.AppointmentStatus;
import com.servicebooking.service_booking.entity.Review;
import com.servicebooking.service_booking.entity.User;
import com.servicebooking.service_booking.repository.AppointmentRepository;
import com.servicebooking.service_booking.repository.ReviewRepository;
import com.servicebooking.service_booking.repository.UserRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepo userRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            AppointmentRepository appointmentRepository,
            UserRepo userRepository) {

        this.reviewRepository = reviewRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    public ReviewResponse createReview(ReviewRequest request) {


        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();


        User customer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));


        Appointment appointment = appointmentRepository
                .findById(request.getAppointmentId())
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found"));


        if (!appointment.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException(
                    "You can only review your own appointment"
            );
        }


        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new RuntimeException(
                    "Review can only be submitted after appointment is completed"
            );
        }


        if (reviewRepository.existsByAppointmentId(
                appointment.getId())) {

            throw new RuntimeException(
                    "This appointment has already been reviewed"
            );
        }


        Review review = new Review();

        review.setAppointment(appointment);
        review.setCustomer(customer);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);

        return convertToResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsByService(Long serviceId) {

        return reviewRepository.findByAppointmentServiceId(serviceId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<ReviewResponse> getAllReviews() {

        return reviewRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private ReviewResponse convertToResponse(Review review) {

        ReviewResponse response = new ReviewResponse();

        Appointment appointment = review.getAppointment();

        response.setId(review.getId());

        response.setAppointmentId(appointment.getId());

        response.setCustomerId(review.getCustomer().getId());
        response.setCustomerName(review.getCustomer().getName());

        response.setServiceId(appointment.getService().getId());
        response.setServiceName(
                appointment.getService().getServiceName()
        );

        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());

        return response;
    }
}