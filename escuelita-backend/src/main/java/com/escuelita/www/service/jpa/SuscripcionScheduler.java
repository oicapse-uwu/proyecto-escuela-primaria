package com.escuelita.www.service.jpa;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelita.www.entity.EstadosSuscripcion;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.repository.EstadosSuscripcionRepository;
import com.escuelita.www.repository.SuscripcionesRepository;

/**
 * Servicio para actualizar automáticamente el estado de las suscripciones.
 * Ejecuta un job programado cada día para marcar suscripciones vencidas y reactivar las que fueron renovadas.
 */
@Service
public class SuscripcionScheduler {
    
    @Autowired
    private SuscripcionesRepository suscripcionesRepository;
    
    @Autowired
    private EstadosSuscripcionRepository estadosRepository;
    
    /**
     * Job programado que se ejecuta cada día a las 2:00 AM
     * Actualiza automáticamente los estados de las suscripciones según su fecha de vencimiento
     */
    @Scheduled(cron = "0 0 2 * * *") // Cada día a las 2:00 AM
    @Transactional
    public void actualizarEstadosSuscripciones() {
        LocalDate hoy = LocalDate.now();
        int vencidas = 0;
        int reactivadas = 0;
        
        System.out.println("🔄 Iniciando actualización automática de suscripciones - " + hoy);
        
        try {
            // 1. Marcar como VENCIDAS las suscripciones activas que pasaron su fecha
            List<Suscripciones> activas = suscripcionesRepository.findByEstadoNombre("Activa");
            EstadosSuscripcion estadoVencida = estadosRepository.findByNombre("Vencida")
                .orElseThrow(() -> new RuntimeException("Estado 'Vencida' no encontrado en la BD"));
            
            for (Suscripciones sus : activas) {
                if (sus.getFechaVencimiento().isBefore(hoy)) {
                    sus.setIdEstado(estadoVencida);
                    vencidas++;
                    System.out.println("⚠️  Suscripción vencida: " + sus.getIdInstitucion().getNombre() + 
                        " (Venció: " + sus.getFechaVencimiento() + ")");
                }
            }
            
            if (vencidas > 0) {
                suscripcionesRepository.saveAll(activas);
            }
            
            // 2. REACTIVAR suscripciones vencidas si se extendió la fecha
            List<Suscripciones> vencidasList = suscripcionesRepository.findByEstadoNombre("Vencida");
            EstadosSuscripcion estadoActiva = estadosRepository.findByNombre("Activa")
                .orElseThrow(() -> new RuntimeException("Estado 'Activa' no encontrado en la BD"));
            
            for (Suscripciones sus : vencidasList) {
                // Si la fecha de vencimiento es hoy o futura, reactivar
                if (!sus.getFechaVencimiento().isBefore(hoy)) {
                    sus.setIdEstado(estadoActiva);
                    reactivadas++;
                    System.out.println("✅ Suscripción reactivada: " + sus.getIdInstitucion().getNombre() + 
                        " (Nueva fecha: " + sus.getFechaVencimiento() + ")");
                }
            }
            
            if (reactivadas > 0) {
                suscripcionesRepository.saveAll(vencidasList);
            }
            
            System.out.println("✅ Actualización completada - Vencidas: " + vencidas + " | Reactivadas: " + reactivadas);
            
        } catch (Exception e) {
            System.err.println("❌ Error al actualizar suscripciones: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Método manual para forzar la actualización (útil para testing)
     * Puede ser llamado desde un controller para actualizar bajo demanda
     */
    public void actualizarManualmente() {
        System.out.println("🔧 Actualización manual de suscripciones iniciada");
        actualizarEstadosSuscripciones();
    }
}
