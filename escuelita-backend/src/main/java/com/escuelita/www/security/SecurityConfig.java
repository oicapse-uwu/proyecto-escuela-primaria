package com.escuelita.www.security;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));  // Usar patterns en lugar de origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);  // Permitir credenciales
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http, JwtFilter jwtFilter) throws Exception{
            http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/restful/token"
                        , "/restful/registros"
                        , "/auth/admin/**"  // Autenticación Super Admin
                        , "/auth/escuela/**"  // Autenticación Escuela
                        , "/utils/**"
                        , "/uploads/**"
                        , "/portal/**").permitAll()  // Portal público de padres
                    // Permitir endpoints GET de lectura (dropdowns)
                    .requestMatchers(HttpMethod.GET, "/restful/metodospago", "/restful/deudasalumno", "/restful/conceptospago", "/restful/instituciones", "/restful/grados", "/restful/matriculas", "/restful/alumnos").permitAll()
                    .anyRequest().authenticated()     // Resto de endpoints requieren autenticación
                )
                .addFilterBefore(jwtFilter, 
                    UsernamePasswordAuthenticationFilter.class);
            return http.build();                
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
        
}
