package com.gemhaven.security;

import com.gemhaven.model.User;
import com.gemhaven.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

import org.springframework.core.annotation.Order;

@Component
@Order(1)
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);
        
        if (existingAdmin.isEmpty()) {
            User admin = new User();
            admin.setFullName("System Admin");
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole(User.Role.ADMIN);
            admin.setEmailVerified(true);
            
            userRepository.save(admin);
            System.out.println("[INFO] Predefined admin user seeded successfully: " + adminEmail);
        } else {
            System.out.println("[INFO] Admin user already exists. Skipping admin seed.");
        }

        Optional<User> existingBuyer = userRepository.findByEmail("buyer@gemhaven.com");
        if (existingBuyer.isEmpty()) {
            User buyer = new User();
            buyer.setFullName("Default Buyer");
            buyer.setEmail("buyer@gemhaven.com");
            buyer.setPasswordHash(passwordEncoder.encode("buyer123"));
            buyer.setRole(User.Role.BUYER);
            buyer.setEmailVerified(true);

            userRepository.save(buyer);
            System.out.println("[INFO] Predefined buyer user seeded successfully: buyer@gemhaven.com");
        }
    }
}
