package com.escuelita.www.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private TenantInterceptor tenantInterceptor;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configurar para servir archivos estáticos desde la carpeta uploads
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Registrar el interceptor para limpiar TenantContext después de cada request
        registry.addInterceptor(tenantInterceptor);
    }
}
