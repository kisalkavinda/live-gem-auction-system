package com.gemhaven.dto;

import com.gemhaven.model.User;

public class UserProfileDTO {

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private boolean emailVerified;

    public UserProfileDTO(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.emailVerified = user.isEmailVerified();
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public boolean isEmailVerified() { return emailVerified; }
}
