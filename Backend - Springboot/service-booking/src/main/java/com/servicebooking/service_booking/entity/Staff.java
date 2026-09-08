package com.servicebooking.service_booking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String skills;

    private String experience;

    public Staff() {
    }

    public Staff(User user, String skills, String experience) {
        this.user = user;
        this.skills = skills;
        this.experience = experience;
    }
}
