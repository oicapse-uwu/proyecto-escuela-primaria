// NUEVO - Endpoint para generar hash de contraseña para super_admins
package com.escuelita.www.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/utils")
@CrossOrigin(origins = "*")
public class UtilsController {
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @PostMapping("/generate-hash")
    public ResponseEntity<?> generateHash(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        if (password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
        }
        
        String hash = passwordEncoder.encode(password);
        
        Map<String, String> response = new HashMap<>();
        response.put("password", password);
        response.put("hash", hash);
        response.put("sql", "UPDATE super_admins SET password = '" + hash + "' WHERE usuario = 'TU_USUARIO';");
        
        return ResponseEntity.ok(response);
    }
}
