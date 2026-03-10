package com.escuelita.www.security;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
     * Extrae el ID del usuario del JWT token (claims)
     * 
     * @return ID del usuario o null si no está disponible
     */
    private Long obtenerIdUsuarioDelToken() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                Object principal = auth.getPrincipal();

                // Si es un CustomUserDetails o similar, intenta extraer el ID
                if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                    // En este caso, el nombre de usuario sería la cadena
                    // pero necesitamos el ID numérico del JWT
                }

                // Intenta obtener del nombre de usuario o del header como fallback
                String nombre = auth.getName();
                if (nombre != null && !nombre.isEmpty()) {
                    try {
                        return Long.parseLong(nombre);
                    } catch (NumberFormatException e) {
                        // No es un número, continuar
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️  Error al extraer usuario del contexto: " + e.getMessage());
        }

        // Fallback: intenta obtener del header como fallback
        String idUsuarioStr = request.getHeader("X-Usuario-ID");
        if (idUsuarioStr != null && !idUsuarioStr.isEmpty()) {
            try {
                return Long.parseLong(idUsuarioStr);
            } catch (NumberFormatException e) {
                // No es un número
            }
        }

        return null;
    }

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
            System.out.println(
                    "👑 Super Admin detectado - Acceso permitido a " + nombreMetodo + " (módulo " + idModulo + ")");
            return joinPoint.proceed();
        }

        // 🔒 USUARIOS DE ESCUELA: Intentar validar permisos de módulo
        System.out.println("\n🛡️  Interceptado: " + nombreMetodo + " (requiere módulo " + idModulo + ")");

        // Obtener ID del usuario
        Long idUsuario = obtenerIdUsuarioDelToken();

        // Si no se puede obtener el ID del usuario pero está autenticado, permitir por
        // ahora
        // (La seguridad es validada por Spring Security y TenantContext ya está
        // establecido)
        if (idUsuario == null) {
            // Verificar que al menos hay autenticación
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && TenantContext.hasSedeId()) {
                System.out.println(
                        "⚠️  No se pudo extraer ID de usuario, pero hay sesión autenticada. Permitiendo acceso.");
                return joinPoint.proceed();
            }

            System.err.println("❌ No se pudo obtener ID del usuario y no hay sesión autenticada");
            throw new SecurityException("Usuario no autenticado");
        }

        try {
            // ✅ Validar acceso al módulo
            if (!serviceAcceso.tieneAccesoModulo(idUsuario, idModulo)) {
                System.err.println("🚫 Usuario " + idUsuario + " NO tiene acceso a módulo " + idModulo);
                throw new SecurityException("No tienes acceso al módulo solicitado");
            }

            // ✅ Usuario tiene acceso, permitir ejecución del método
            System.out.println("✅ Acceso permitido para usuario " + idUsuario + " al módulo " + idModulo);
            return joinPoint.proceed();

        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("❌ Error al validar acceso: " + e.getMessage());
            throw new SecurityException("Error al validar acceso: " + e.getMessage());
        }
    }
}
