package com.escuelita.www.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.LoginRequest;
import com.escuelita.www.entity.LoginResponse;
import com.escuelita.www.entity.SuperAdmins;
import com.escuelita.www.repository.SuperAdminsRepository;
import com.escuelita.www.service.jpa.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private SuperAdminsRepository superAdminsRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Usuario o contraseña incorrectos");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    
    /* Registrar un nuevo usuario en POSTMAN
        Body: { "nombres": "Juan", "apellidos": "Pérez", "correo": "email@test.com", 
                "usuario": "admin", "contrasena": "mipassword" }
    */
    @PostMapping("/register-superadmin")
    public ResponseEntity<?> registerSuperAdmin(@RequestBody Map<String, String> request) {
        try {
            // Validar que existan los campos requeridos
            if (!request.containsKey("nombres") || !request.containsKey("apellidos") ||
                !request.containsKey("correo") || !request.containsKey("usuario") ||
                !request.containsKey("contrasena")) {
                return ResponseEntity.badRequest().body(Map.of("mensaje", "Faltan campos requeridos"));
            }
            
            // Verificar si el usuario ya existe
            if (superAdminsRepository.findByUsuario(request.get("usuario")).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("mensaje", "El usuario ya existe"));
            }
            
            // Crear nuevo super admin
            SuperAdmins admin = new SuperAdmins();
            admin.setNombres(request.get("nombres"));
            admin.setApellidos(request.get("apellidos"));
            admin.setCorreo(request.get("correo"));
            admin.setUsuario(request.get("usuario"));
            
            // HASHEAR LA CONTRASEÑA AUTOMÁTICAMENTE
            String passwordHash = passwordEncoder.encode(request.get("contrasena"));
            admin.setPassword(passwordHash);
            
            admin.setRolPlataforma("SUPER_ADMIN");
            admin.setEstado(1);
            
            // Guardar en la BD
            SuperAdmins savedAdmin = superAdminsRepository.save(admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Super admin creado exitosamente");
            response.put("id", savedAdmin.getIdAdmin());
            response.put("usuario", savedAdmin.getUsuario());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error al crear super admin: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
