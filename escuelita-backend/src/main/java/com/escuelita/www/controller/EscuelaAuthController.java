// Controlador para autenticación de usuarios - NUEVO
package com.escuelita.www.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.EscuelaLoginResponse;
import com.escuelita.www.entity.LoginRequest;
import com.escuelita.www.service.jpa.EscuelaAuthService;

@RestController
@RequestMapping("/auth/escuela")
@CrossOrigin(origins = "*")
public class EscuelaAuthController {

    @Autowired
    private EscuelaAuthService escuelaAuthService;

    // Login para usuarios de escuela (profesores, secretarias, etc.)
    // Endpoint: POST /auth/escuela/login

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            EscuelaLoginResponse response = escuelaAuthService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            
            // Mensajes de error más específicos
            String mensaje = e.getMessage();
            if (mensaje.contains("Usuario no encontrado")) {
                error.put("mensaje", "Usuario no encontrado");
            } else if (mensaje.contains("Usuario inactivo")) {
                error.put("mensaje", "Usuario inactivo. Contacte al administrador");
            } else if (mensaje.contains("sin sede")) {
                error.put("mensaje", "Usuario sin sede asignada. Contacte al administrador");
            } else {
                error.put("mensaje", "Usuario o contraseña incorrectos");
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // Verificar token del usuario
    // Endpoint: POST /auth/escuela/verify

    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken() {
        // Verificacion del token se maneja en el filtro de seguridad, si llega aquí es porque el token es válido
        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("message", "Token válido");
        return ResponseEntity.ok(response);
    }
}
