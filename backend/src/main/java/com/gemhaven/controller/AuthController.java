package com.gemhaven.controller;

import com.gemhaven.dto.*;
import com.gemhaven.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, Boolean>> resendVerification(@RequestBody Map<String, String> body) {
        authService.resendVerification(body.get("email"));
        return ResponseEntity.ok(Map.of("sent", true));
    }

    @GetMapping("/verify-email/{token}")
    public ResponseEntity<Map<String, Object>> verifyEmail(@PathVariable String token) {
        String email = authService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("verified", true, "email", email));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.getMe(userDetails.getUsername()));
    }
}
