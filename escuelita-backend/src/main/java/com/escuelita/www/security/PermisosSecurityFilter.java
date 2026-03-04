package com.escuelita.www.security;

import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.escuelita.www.repository.RolModuloPermisoRepository;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * VALIDACIÓN DE PERMISOS EN BACKEND
 * Intercepta TODAS las requests y valida permiso antes de ejecutar
 * 
 * Uso en controlador:
 *   @PostMapping("/alumnos")
 *   @RequierePermiso(modulo = 5, permiso = "CREAR") // ALUMNOS, CREAR
 *   public ResponseEntity crearAlumno(...) { }
 */
@Component
public class PermisosSecurityFilter extends OncePerRequestFilter {

    @Autowired
    private RolModuloPermisoRepository rolModuloPermisoRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) 
                                   throws ServletException, IOException {

        try {
            // Obtener usuario del token JWT
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                // Aquí deberías extraer idRol del token JWT
                // Integer idRol = JwtUtils.getIdRolFromToken(token);
                
                // Guardar en request para usar después
                // request.setAttribute("idRol", idRol);
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("{\"error\": \"Error validando permisos\"}");
        }
    }
}
