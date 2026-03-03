package com.escuelita.www.service.jpa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.EscuelaLoginResponse;
import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.LoginRequest;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.entity.UsuarioEscuelaDTO;
import com.escuelita.www.entity.UsuarioEscuelaDTO.RolDTO;
import com.escuelita.www.entity.UsuarioEscuelaDTO.SedeDTO;
import com.escuelita.www.entity.Usuarios;
import com.escuelita.www.repository.UsuariosRepository;
import com.escuelita.www.security.JwtUtil;

@Service
public class EscuelaAuthService {
    
    @Autowired
    private UsuariosRepository usuariosRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private SuscripcionValidator suscripcionValidator;
    
    public EscuelaLoginResponse authenticate(LoginRequest request) throws Exception {
        // 1. Buscar usuario en la BD por usuario
        Usuarios usuario = usuariosRepository.findByUsuario(request.getUsuario())
            .orElseThrow(() -> new Exception("Usuario no encontrado"));
        
        // 2. Validar estado activo
        if (usuario.getEstado() != 1) {
            throw new Exception("Usuario inactivo");
        }
        
        // 3. Validar contraseña
        String passwordBD = usuario.getContrasena();
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
                usuario.setContrasena(nuevoHash);
                usuariosRepository.save(usuario);
                
                System.out.println("⚠️  Contraseña actualizada a formato hash para usuario de escuela: " + usuario.getUsuario());
            }
        }
        
        if (!passwordValida) {
            throw new Exception("Contraseña incorrecta");
        }
        
        // 4. Validar que tenga sede asignada (multi-tenancy)
        if (usuario.getIdSede() == null) {
            throw new Exception("Usuario sin sede asignada");
        }
        
        Sedes sede = usuario.getIdSede();
        
        // 5. VALIDAR SUSCRIPCIÓN ACTIVA
        // Obtener la institución de la sede
        Institucion institucion = sede.getIdInstitucion();
        if (institucion == null) {
            throw new Exception("La sede no tiene una institución asociada");
        }
        
        // Validar que la institución tenga suscripción activa
        try {
            Suscripciones suscripcion = suscripcionValidator.validarSuscripcionActiva(institucion);
            System.out.println("✅ Suscripción válida para institución: " + institucion.getNombre() + 
                " (Vence: " + suscripcion.getFechaVencimiento() + ")");
        } catch (Exception e) {
            // Lanzar la excepción con el mensaje específico
            throw new Exception("⚠️  ACCESO DENEGADO: " + e.getMessage());
        }
        
        // 6. Generar token JWT con tipo de usuario y sede
        String token = jwtUtil.generarToken("ESCUELA_" + usuario.getIdUsuario().toString() + "_SEDE_" + usuario.getIdSede().getIdSede());
        
        // 7. Convertir a DTO y retornar
        UsuarioEscuelaDTO usuarioDTO = convertToDTO(usuario);
        return new EscuelaLoginResponse(token, usuarioDTO);
    }
    
    private UsuarioEscuelaDTO convertToDTO(Usuarios usuario) {
        UsuarioEscuelaDTO dto = new UsuarioEscuelaDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombres(usuario.getNombres());
        dto.setApellidos(usuario.getApellidos());
        dto.setCorreo(usuario.getCorreo());
        dto.setUsuario(usuario.getUsuario());
        dto.setFotoPerfil(usuario.getFotoPerfil());
        
        // Crear rol DTO
        if (usuario.getIdRol() != null) {
            RolDTO rol = new RolDTO(
                usuario.getIdRol().getIdRol(), 
                usuario.getIdRol().getNombre()
            );
            dto.setRol(rol);
        }
        
        // Crear sede DTO (multi-tenancy)
        if (usuario.getIdSede() != null) {
            SedeDTO sede = new SedeDTO(
                usuario.getIdSede().getIdSede(), 
                usuario.getIdSede().getNombreSede()
            );
            dto.setSede(sede);
        }
        
        return dto;
    }
}
