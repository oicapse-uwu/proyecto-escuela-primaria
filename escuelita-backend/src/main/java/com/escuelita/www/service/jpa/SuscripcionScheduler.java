package com.escuelita.www.service.jpa;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelita.www.entity.EstadoVerificacion;
import com.escuelita.www.entity.EstadosSuscripcion;
import com.escuelita.www.entity.PagoSuscripcion;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.repository.EstadosSuscripcionRepository;
import com.escuelita.www.repository.PagoSuscripcionRepository;
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
    
    @Autowired
    private PagoSuscripcionRepository pagoRepository;
    
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
     * Job programado que valida pagos mensuales
     * Marca como VENCIDA las suscripciones ACTIVAS con ciclo MENSUAL que no tienen pago del mes actual
     * Se ejecuta cada día a las 3:00 AM (1 hora después del job principal)
     */
    @Scheduled(cron = "0 0 3 * * *") // Cada día a las 3:00 AM
    @Transactional
    public void validarPagosMensuales() {
        LocalDate hoy = LocalDate.now();
        int suspendidasPorFaltaPago = 0;
        
        System.out.println("🔄 Iniciando validación de pagos mensuales - " + hoy);
        
        try {
            // Obtener todas las suscripciones ACTIVAS con ciclo MENSUAL (1 mes)
            List<Suscripciones> susActivas = suscripcionesRepository.findByEstadoNombre("Activa");
            EstadosSuscripcion estadoVencida = estadosRepository.findByNombre("Vencida")
                .orElseThrow(() -> new RuntimeException("Estado 'Vencida' no encontrado en la BD"));
            
            for (Suscripciones sus : susActivas) {
                // Solo procesar suscripciones con ciclo MENSUAL
                if (sus.getIdCiclo() != null && sus.getIdCiclo().getMesesDuracion() == 1) {
                    
                    // Obtener día de corte (día de inicio de suscripción)
                    int diaCorte = sus.getFechaInicio().getDayOfMonth();
                    
                    // Calcular inicio del período actual basado en día de corte
                    LocalDate inicioPeriodoActual;
                    try {
                        inicioPeriodoActual = hoy.withDayOfMonth(diaCorte);
                    } catch (Exception e) {
                        // Si el día no existe (ej: 31 en febrero), usar último día del mes
                        inicioPeriodoActual = hoy.withDayOfMonth(hoy.lengthOfMonth());
                    }
                    
                    // Si hoy es antes del día de corte, el período actual es el mes anterior
                    if (hoy.getDayOfMonth() < diaCorte) {
                        inicioPeriodoActual = inicioPeriodoActual.minusMonths(1);
                    }
                    
                    final LocalDate inicioPeriodo = inicioPeriodoActual; // Variable final para lambda
                    LocalDate finPeriodoActual = inicioPeriodoActual.plusMonths(1);
                    final LocalDate finPeriodo = finPeriodoActual; // Variable final para lambda
                    
                    // Buscar si hay algún pago VERIFICADO que cubra el período actual
                    List<PagoSuscripcion> pagosVerificados = pagoRepository
                        .findBySuscripcionIdAndEstadoVerificacion(sus.getIdSuscripcion(), EstadoVerificacion.VERIFICADO);
                    
                    boolean tienePagoActual = pagosVerificados.stream()
                        .anyMatch(pago -> 
                            !pago.getFechaPago().isBefore(inicioPeriodo) &&
                            pago.getFechaPago().isBefore(finPeriodo)
                        );
                    
                    // Si no tiene pago del período actual → VENCIDA
                    if (!tienePagoActual) {
                        sus.setIdEstado(estadoVencida);
                        suscripcionesRepository.save(sus); // Guardar individualmente
                        suspendidasPorFaltaPago++;
                        System.out.println("⚠️  Suscripción ID " + sus.getIdSuscripcion() + 
                            " (" + sus.getIdInstitucion().getNombre() + ") marcada como VENCIDA. " +
                            "No hay pago verificado para el período: " + inicioPeriodo + 
                            " a " + finPeriodo + " (Día de corte: " + diaCorte + ")");
                    }
                }
            }
            
            System.out.println("✅ Validación de pagos mensuales completada - Suspendidas por falta de pago: " + suspendidasPorFaltaPago);
            
        } catch (Exception e) {
            System.err.println("❌ Error al validar pagos mensuales: " + e.getMessage());
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
