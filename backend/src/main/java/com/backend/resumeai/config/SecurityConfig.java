package com.backend.resumeai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF protection (use with caution)
                .csrf(AbstractHttpConfigurer::disable)
                // Allow all requests without authentication (adjust as needed)
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll()
                )
                // Disable form login
                .formLogin(AbstractHttpConfigurer::disable)
                // Disable HTTP Basic authentication
                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}
