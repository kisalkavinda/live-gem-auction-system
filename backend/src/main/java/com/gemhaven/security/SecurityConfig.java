package com.gemhaven.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, UserDetailsServiceImpl userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    @SuppressWarnings("null")
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // WebSocket endpoint — public (auth handled inside STOMP headers)
                .requestMatchers("/ws/**").permitAll()

                // Auth endpoints — all public
                .requestMatchers("/api/auth/**").permitAll()

                // Public READ access to content
                .requestMatchers(HttpMethod.GET, "/api/gems/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auctions/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/land/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()

                // Admin-only — full management
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/upload").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/gems/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/gems/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/gems/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/auctions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/auctions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/auctions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/land/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/land/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/land/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/articles/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/articles/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/articles/**").hasRole("ADMIN")

                // Buyer-required actions (booking + gem purchase override)
                .requestMatchers("/api/land/*/bookings").hasRole("BUYER")
                .requestMatchers("/api/gems/*/purchase").hasRole("BUYER")

                // Anything else requires authentication
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex.authenticationEntryPoint(new org.springframework.security.web.authentication.HttpStatusEntryPoint(org.springframework.http.HttpStatus.UNAUTHORIZED)))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
