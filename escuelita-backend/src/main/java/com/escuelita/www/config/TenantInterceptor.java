package com.escuelita.www.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.escuelita.www.util.TenantContext;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Interceptor para limpiar el TenantContext después de cada request.
// Esto previene memory leaks en aplicaciones multithreaded.

@Component
public class TenantInterceptor implements HandlerInterceptor {
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                                Object handler, Exception ex) throws Exception {
        // Limpiar el contexto después de completar el request
        TenantContext.clear();
    }
}

/*  
    Request: Llega una petición de "Escuela A". 
    Proceso: El sistema identifica que es la "Escuela A" y lo guarda en el contexto.
    Respuesta: Se termina de procesar y se envía la respuesta.
    Interceptor (El código): Entra en acción y dice: 
    "Listo, ya terminamos con la Escuela A, borremos su 
    ID del contexto para que el sistema quede limpio". 
*/