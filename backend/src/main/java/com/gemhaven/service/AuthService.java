package com.gemhaven.service;

import com.gemhaven.dto.AuthRequest;
import com.gemhaven.dto.AuthResponse;
import com.gemhaven.dto.RegisterRequest;
import com.gemhaven.dto.UserProfileDTO;
import com.gemhaven.model.User;
import com.gemhaven.repository.UserRepository;
import com.gemhaven.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.BUYER);
        user.setEmailVerified(false);
        user.setVerificationToken(UUID.randomUUID().toString());

        userRepository.save(user);

        // NOTE: In production, send this token via email (SMTP/SendGrid — out of scope).
        // For development, the token is logged and returned in the response for testing.
        System.out.println("[DEV] Email verification token for " + user.getEmail() + ": " + user.getVerificationToken());

        String jwt = jwtUtil.generateToken(user.getEmail());
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
        return new AuthResponse(jwt, userInfo);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String jwt = jwtUtil.generateToken(user.getEmail());
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
        return new AuthResponse(jwt, userInfo);
    }

    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.isEmailVerified()) {
            throw new IllegalStateException("Email is already verified.");
        }

        user.setVerificationToken(UUID.randomUUID().toString());
        userRepository.save(user);

        System.out.println("[DEV] Resent verification token for " + user.getEmail() + ": " + user.getVerificationToken());
    }

    public String verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired verification token."));

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return user.getEmail();
    }

    public UserProfileDTO getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new UserProfileDTO(user);
    }
}
