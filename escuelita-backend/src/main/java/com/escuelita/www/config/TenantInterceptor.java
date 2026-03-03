package com.escuelita.www.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.escuelita.www.util.TenantContext;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Interceptor para limpiar el TenantContext después de cada request.
 * Esto previene memory leaks en aplicaciones multithreaded.
 */
@Component
public class TenantInterceptor implements HandlerInterceptor {
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                               Object handler, Exception ex) throws Exception {
        // Limpiar el contexto después de completar el request
        TenantContext.clear();
    }
}
