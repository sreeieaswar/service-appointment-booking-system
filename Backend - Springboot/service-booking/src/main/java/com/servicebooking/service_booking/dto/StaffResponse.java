package com.servicebooking.service_booking.dto;

public class StaffResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String skills;
    private String experience;
    private boolean active;

    public StaffResponse() {
    }

    public StaffResponse(Long id, Long userId, String name, String email,
                         String skills, String experience, boolean active) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.skills = skills;
        this.experience = experience;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}