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
public class AuthService {
    
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
        
        // 2. Validar contraseña
        if (!passwordEncoder.matches(request.getContrasena(), admin.getPassword())) {
            throw new Exception("Contraseña incorrecta");
        }
        
        // 3. Generar token JWT
        String token = jwtUtil.generarToken(admin.getIdAdmin().toString());
        
        // 4. Convertir a DTO y retornar
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
        
        // Crear rol DTO
        RolDTO rol = new RolDTO(1, admin.getRolPlataforma());
        dto.setRol(rol);
        
        return dto;
    }
}
