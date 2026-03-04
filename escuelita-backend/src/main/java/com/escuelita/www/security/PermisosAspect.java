package com.escuelita.www.security;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import com.escuelita.www.repository.RolModuloPermisoRepository;
import com.escuelita.www.model.Usuario;
import lombok.extern.slf4j.Slf4j;

/**
 * VALIDADOR DE PERMISOS CON AOP
 * 
 * Cuando ve @RequierePermiso(idModulo=5, codigo="CREAR")
 * Valida que el usuario logueado tenga ese permiso
 * 
 * Si NO tiene permiso: Lanza excepción 403 FORBIDDEN
 * Si SÍ tiene permiso: Permite que siga adelante (proceedingJoinPoint.proceed())
 */
@Aspect
@Component
@Slf4j
public class PermisosAspect {

    @Autowired
    private RolModuloPermisoRepository rolModuloPermisoRepository;

    @Around("@annotation(com.escuelita.www.security.RequierePermiso)")
    public Object validarPermiso(ProceedingJoinPoint joinPoint) throws Throwable {

        // Obtener anotación de la acción
        RequierePermiso requierePermiso = 
            ((org.springframework.aop.framework.AopProxyUtils
                .ultimateTargetClass(joinPoint.getTarget())
                    .getDeclaredMethod(
                        joinPoint.getSignature().getName(),
                        getParameterTypes(joinPoint)
                    )
                    .getAnnotation(RequierePermiso.class)));

        if (requierePermiso == null) {
            return joinPoint.proceed();
        }

        // Obtener usuario logueado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("⛔ Intento de acceso sin autenticación");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado");
        }

        // Obtener el usuario del contexto de seguridad
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Integer idRol = usuario.getIdRol(); // El rol del usuario logueado

        // Obtener datos del permiso requerido
        int idModulo = requierePermiso.idModulo();
        String codigoPermiso = requierePermiso.codigo();

        // VALIDAR: ¿El rol tiene este permiso?
        boolean tienePermiso = rolModuloPermisoRepository
            .existsByIdRol_IdRolAndIdModulo_IdModuloAndIdPermiso_CodigoAndEstado(
                idRol,
                idModulo,
                codigoPermiso,
                1 // estado activo
            );

        if (!tienePermiso) {
            log.warn(String.format(
                "⛔ Usuario rol_id=%d intenta %s en módulo_id=%d pero NO tiene permiso",
                idRol, codigoPermiso, idModulo
            ));
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, 
                "No tienes permiso para: " + codigoPermiso
            );
        }

        log.info(String.format(
            "✅ Usuario rol_id=%d tiene permiso %s en módulo_id=%d",
            idRol, codigoPermiso, idModulo
        ));

        // Si llegó aquí, tiene permiso - dejar que siga
        return joinPoint.proceed();
    }

    private Class<?>[] getParameterTypes(ProceedingJoinPoint joinPoint) {
        org.springframework.aop.framework.AopProxyUtils
            .ultimateTargetClass(joinPoint.getTarget())
            .getDeclaredMethods();
        return new Class<?>[]{};
    }
}
