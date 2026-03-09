package com.escuelita.www.security;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.escuelita.www.entity.Registros;
import com.escuelita.www.repository.RegistrosRepository;
import com.escuelita.www.util.TenantContext;

import jakarta.servlet.FilterChain;
import jakarta.servlet.GenericFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtFilter extends GenericFilter{
    @Autowired
    private RegistrosRepository registrosRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                    FilterChain chain) throws IOException, 
                    ServletException{
        HttpServletRequest request = (HttpServletRequest) req;
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            
            // Primero intentar validar como token JWT (para Super Admins)
            if (jwtUtil.validarToken(token)) {
                String clienteId = jwtUtil.extraerClienteId(token);
                
                // Verificar si el clienteId existe en tabla Registros (acceso SUPER_ADMIN)
                Optional<Registros> registroMatch = registrosRepository
                            .findAll().stream()
                            .filter(r -> clienteId.equals(r.getCliente_id()))
                            .findFirst();
                
                if (registroMatch.isPresent()) {
                    // Usuario de tabla Registros → acceso SUPER_ADMIN
                    TenantContext.setUserType("SUPER_ADMIN");
                    System.out.println("🔑 Token JWT de Registros '" + clienteId + "' - Acceso SUPER_ADMIN sin restricciones");
                } else if (clienteId.contains("_SEDE_")) {
                    // Extraer sede del token si es usuario de escuela
                    // Formato: "ESCUELA_123_SEDE_45"
                    try {
                        String[] parts = clienteId.split("_SEDE_");
                        if (parts.length == 2) {
                            Long sedeId = Long.parseLong(parts[1]);
                            TenantContext.setSedeId(sedeId);
                            TenantContext.setUserType("ESCUELA");
                            System.out.println("🏫 Usuario de ESCUELA - Sede ID: " + sedeId);
                        }
                    } catch (NumberFormatException e) {
                        System.err.println("⚠️  Error al extraer sede del token: " + clienteId);
                    }
                } else if (clienteId.startsWith("SUPER_ADMIN") || clienteId.startsWith("ADMIN_")) {
                    TenantContext.setUserType("SUPER_ADMIN");
                    System.out.println("👑 Super Admin - Sin restricción de sede");
                }
                
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(clienteId, 
                            null, Collections.emptyList());
                SecurityContextHolder.getContext()
                            .setAuthentication(auth);
            } else {
                // Si no es JWT válido, buscar en tabla Registros (acceso SUPER_ADMIN)
                Optional<Registros> match = registrosRepository
                            .findAll().stream()
                            .filter(r ->token.equals(r.getAccess_token()))
                            .findFirst();

                if(match.isPresent()){
                    String clienteId = match.get().getCliente_id();
                    
                    // Configurar como SUPER_ADMIN para acceso sin restricciones
                    TenantContext.setUserType("SUPER_ADMIN");
                    System.out.println("🔑 Token de Registros '" + clienteId + "' - Acceso SUPER_ADMIN sin restricciones");
                    
                    UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(clienteId, 
                                null, Collections.emptyList());
                    SecurityContextHolder.getContext()
                                .setAuthentication(auth);            
                }
            }
        }
        chain.doFilter(req, res);
    }
    
}
