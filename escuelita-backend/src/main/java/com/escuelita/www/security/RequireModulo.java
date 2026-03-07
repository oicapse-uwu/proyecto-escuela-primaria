package com.escuelita.www.security;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireModulo {
    /**
     * ID del módulo requerido para acceder al endpoint
     * 
     * Módulos disponibles:
     * 1 = DASHBOARD
     * 2 = CONFIGURACIÓN
     * 3 = INFRAESTRUCTURA
     * 4 = GESTIÓN ACADÉMICA
     * 5 = ALUMNOS
     * 6 = MATRÍCULAS
     * 7 = EVALUACIONES Y NOTAS
     * 8 = PAGOS Y PENSIONES
     */
    long value();
}
