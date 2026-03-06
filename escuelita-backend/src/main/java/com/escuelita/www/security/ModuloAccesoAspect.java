package com.escuelita.www.security;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import com.escuelita.www.service.jpa.ModuloAccesoService;
import jakarta.servlet.http.HttpServletRequest;

@Aspect
@Component
public class ModuloAccesoAspect {
    
    @Autowired
    private ModuloAccesoService serviceAcceso;
    @Autowired
    private HttpServletRequest request;
    
    /**
     * Intercepta llamadas a métodos anotados con @RequireModulo
     * Valida que el usuario tenga acceso al módulo especificado
     */
    @Around("@annotation(requireModulo)")
    public Object validarAcceso(ProceedingJoinPoint joinPoint, RequireModulo requireModulo) 
        throws Throwable {
        
        String nombreMetodo = joinPoint.getSignature().getName();
        long idModulo = requireModulo.value();
        
        System.out.println("\n🛡️  Interceptado: " + nombreMetodo + " (requiere módulo " + idModulo + ")");
        
        // Obtener ID del usuario del header
        String idUsuarioStr = request.getHeader("X-Usuario-ID");
        if (idUsuarioStr == null || idUsuarioStr.isEmpty()) {
            System.err.println("❌ Header X-Usuario-ID no proporcionado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("❌ Header X-Usuario-ID es requerido");
        }
        
        try {
            Long idUsuario = Long.parseLong(idUsuarioStr);
            
            // ✅ Validar acceso al módulo
            if (!serviceAcceso.tieneAccesoModulo(idUsuario, idModulo)) {
                System.err.println("🚫 Usuario " + idUsuario + " NO tiene acceso a módulo " + idModulo);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("❌ No tienes acceso al módulo solicitado");
            }
            
            // ✅ Usuario tiene acceso, permitir ejecución del método
            System.out.println("✅ Acceso permitido para usuario " + idUsuario + " al módulo " + idModulo);
            return joinPoint.proceed();
            
        } catch (NumberFormatException e) {
            System.err.println("❌ X-Usuario-ID debe ser un número válido: " + idUsuarioStr);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("❌ Header X-Usuario-ID debe ser un número válido");
        }
    }
}
