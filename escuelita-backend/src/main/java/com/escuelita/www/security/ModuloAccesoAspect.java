package com.escuelita.www.security;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.escuelita.www.service.jpa.ModuloAccesoService;
import com.escuelita.www.util.TenantContext;

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
     * 
     * NOTA: Los SUPER ADMINS tienen acceso a TODO sin validación
     */
    @Around("@annotation(requireModulo)")
    public Object validarAcceso(ProceedingJoinPoint joinPoint, RequireModulo requireModulo) 
        throws Throwable {
        
        String nombreMetodo = joinPoint.getSignature().getName();
        long idModulo = requireModulo.value();
        
        // ✅ SUPER ADMINS: Acceso completo sin validación
        if (TenantContext.isSuperAdmin()) {
            System.out.println("👑 Super Admin detectado - Acceso permitido a " + nombreMetodo + " (módulo " + idModulo + ")");
            return joinPoint.proceed();
        }
        
        // 🔒 USUARIOS DE ESCUELA: Validar permisos de módulo
        System.out.println("\n🛡️  Interceptado: " + nombreMetodo + " (requiere módulo " + idModulo + ")");
        
        // Obtener ID del usuario del header
        String idUsuarioStr = request.getHeader("X-Usuario-ID");
        if (idUsuarioStr == null || idUsuarioStr.isEmpty()) {
            System.err.println("❌ Header X-Usuario-ID no proporcionado");
            throw new SecurityException("Header X-Usuario-ID es requerido");
        }
        
        try {
            Long idUsuario = Long.parseLong(idUsuarioStr);
            
            // ✅ Validar acceso al módulo
            if (!serviceAcceso.tieneAccesoModulo(idUsuario, idModulo)) {
                System.err.println("🚫 Usuario " + idUsuario + " NO tiene acceso a módulo " + idModulo);
                throw new SecurityException("No tienes acceso al módulo solicitado");
            }
            
            // ✅ Usuario tiene acceso, permitir ejecución del método
            System.out.println("✅ Acceso permitido para usuario " + idUsuario + " al módulo " + idModulo);
            return joinPoint.proceed();
            
        } catch (NumberFormatException e) {
            System.err.println("❌ X-Usuario-ID debe ser un número válido: " + idUsuarioStr);
            throw new SecurityException("Header X-Usuario-ID debe ser un número válido");
        }
    }
}
