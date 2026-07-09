package com.gemhaven.dto;

public class AuthResponse {

    private String token;
    private UserInfo user;

    public AuthResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public UserInfo getUser() { return user; }

    public static class UserInfo {
        private Long id;
        private String fullName;
        private String email;
        private String role;

        public UserInfo(Long id, String fullName, String email, String role) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
        }

        public Long getId() { return id; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}
