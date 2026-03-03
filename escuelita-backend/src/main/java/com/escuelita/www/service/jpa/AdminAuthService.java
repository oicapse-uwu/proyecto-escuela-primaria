package com.escuelita.www.service.jpa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.LoginRequest;
import com.escuelita.www.entity.LoginResponse;
import com.escuelita.www.entity.SuperAdminDTO;
import com.escuelita.www.entity.SuperAdminDTO.RolDTO;
import com.escuelita.www.entity.SuperAdmins;
import com.escuelita.www.repository.SuperAdminsRepository;
import com.escuelita.www.security.JwtUtil;

@Service
public class AdminAuthService {
    
    @Autowired
    private SuperAdminsRepository superAdminsRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public LoginResponse authenticate(LoginRequest request) throws Exception {
        // 1. Buscar super admin en la BD por usuario
        SuperAdmins admin = superAdminsRepository.findByUsuario(request.getUsuario())
            .orElseThrow(() -> new Exception("Usuario no encontrado"));
        
        // 2. Validar estado activo
        if (admin.getEstado() != 1) {
            throw new Exception("Usuario inactivo");
        }
        
        // 3. Validar contraseña
        String passwordBD = admin.getPassword();
        boolean passwordValida = false;
        
        // Detectar si la contraseña en BD está hasheada o en texto plano
        if (passwordBD.startsWith("$2a$") || passwordBD.startsWith("$2y$") || passwordBD.startsWith("$2b$")) {
            // Contraseña hasheada - validar con BCrypt
            passwordValida = passwordEncoder.matches(request.getContrasena(), passwordBD);
        } else {
            // Contraseña en texto plano - comparar directamente
            if (passwordBD.equals(request.getContrasena())) {
                passwordValida = true;
                
                // ACTUALIZAR la contraseña a formato hash automáticamente
                String nuevoHash = passwordEncoder.encode(request.getContrasena());
                admin.setPassword(nuevoHash);
                superAdminsRepository.save(admin);
                
                System.out.println("⚠️  Contraseña actualizada a formato hash para super admin: " + admin.getUsuario());
            }
        }
        
        if (!passwordValida) {
            throw new Exception("Contraseña incorrecta");
        }
        
        // 4. Generar token JWT con tipo de usuario
        String token = jwtUtil.generarToken("SUPER_ADMIN_" + admin.getIdAdmin().toString());
        
        // 5. Convertir a DTO y retornar
        SuperAdminDTO adminDTO = convertToDTO(admin);
        return new LoginResponse(token, adminDTO);
    }
    
    private SuperAdminDTO convertToDTO(SuperAdmins admin) {
        SuperAdminDTO dto = new SuperAdminDTO();
        dto.setIdUsuario(admin.getIdAdmin());
        dto.setNombres(admin.getNombres());
        dto.setApellidos(admin.getApellidos());
        dto.setCorreo(admin.getCorreo());
        dto.setUsuario(admin.getUsuario());
        dto.setFotoUrl(admin.getFotoUrl());
        
        // Crear rol DTO
        RolDTO rol = new RolDTO(1, "SUPER_ADMIN");
        dto.setRol(rol);
        
        return dto;
    }
}
