package com.servicebooking.service_booking.controller;

import com.servicebooking.service_booking.dto.ReviewRequest;
import com.servicebooking.service_booking.dto.ReviewResponse;
import com.servicebooking.service_booking.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request) {

        ReviewResponse response =
                reviewService.createReview(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/reviews/service/{serviceId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByService(
            @PathVariable Long serviceId) {

        List<ReviewResponse> reviews =
                reviewService.getReviewsByService(serviceId);

        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {

        List<ReviewResponse> reviews =
                reviewService.getAllReviews();

        return ResponseEntity.ok(reviews);
    }
}
