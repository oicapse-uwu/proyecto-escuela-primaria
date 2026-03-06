package com.escuelita.www.service.jpa;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.EstadoVerificacion;
import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.PagoSuscripcion;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.repository.PagoSuscripcionRepository;
import com.escuelita.www.repository.SuscripcionesRepository;

/**
 * Servicio para validar el estado de las suscripciones.
 * Verifica que una institución tenga una suscripción activa y vigente.
 */
@Service
public class SuscripcionValidator {
    
    @Autowired
    private SuscripcionesRepository suscripcionesRepository;
    
    @Autowired
    private PagoSuscripcionRepository pagoRepository;
    
    /**
     * Valida que una institución tenga una suscripción activa y no vencida.
     * NO verifica pagos - para uso general en listados y consultas.
     * 
     * @param institucion La institución a validar
     * @return La suscripción activa si es válida
     * @throws Exception Si no hay suscripción activa o está vencida
     */
    public Suscripciones validarSuscripcionActiva(Institucion institucion) throws Exception {
        if (institucion == null) {
            throw new Exception("Institución no puede ser nula");
        }
        
        // Buscar suscripción activa
        Optional<Suscripciones> suscripcionOpt = suscripcionesRepository
            .findSuscripcionActivaByInstitucion(institucion);
        
        if (!suscripcionOpt.isPresent()) {
            throw new Exception("La institución no tiene una suscripción activa. Contacte al administrador para renovar su suscripción.");
        }
        
        Suscripciones suscripcion = suscripcionOpt.get();
        
        // Validar que no esté vencida por fecha
        LocalDate hoy = LocalDate.now();
        if (suscripcion.getFechaVencimiento().isBefore(hoy)) {
            throw new Exception("La suscripción ha vencido el " + suscripcion.getFechaVencimiento() + 
                ". Contacte al administrador para renovar su suscripción.");
        }
        
        return suscripcion;
    }
    
    /**
     * Valida acceso al sistema: verifica suscripción activa Y pagos al día.
     * Usar SOLO para validar login/acceso, no para consultas generales.
     * 
     * @param institucion La institución a validar
     * @return La suscripción activa si es válida y tiene pagos al día
     * @throws Exception Si no hay suscripción activa, está vencida o no tiene pagos al día
     */
    public Suscripciones validarAccesoConPagosAlDia(Institucion institucion) throws Exception {
        // Primero validar suscripción activa
        Suscripciones suscripcion = validarSuscripcionActiva(institucion);
        
        // Luego verificar pagos al día
        List<PagoSuscripcion> pagosVerificados = pagoRepository
            .findBySuscripcionIdAndEstadoVerificacion(
                suscripcion.getIdSuscripcion(), 
                EstadoVerificacion.VERIFICADO
            );
        
        if (pagosVerificados.isEmpty()) {
            throw new Exception("No tiene ningún pago verificado. Debe registrar y esperar la verificación de al menos el primer pago.");
        }
        
        // Verificar que al menos uno de los pagos cubra el período actual
        boolean tienePagoVigente = false;
        Integer mesesDuracion = suscripcion.getIdCiclo() != null ? suscripcion.getIdCiclo().getMesesDuracion() : 1;
        LocalDate hoy = LocalDate.now();
        
        for (PagoSuscripcion pago : pagosVerificados) {
            LocalDate fechaInicioPeriodo = pago.getFechaPago();
            LocalDate fechaFinPeriodo = fechaInicioPeriodo.plusMonths(mesesDuracion);
            
            // Verificar si HOY está dentro del rango [fechaInicioPeriodo, fechaFinPeriodo)
            if (!hoy.isBefore(fechaInicioPeriodo) && hoy.isBefore(fechaFinPeriodo)) {
                tienePagoVigente = true;
                System.out.println("✅ Pago vigente encontrado: " + pago.getNumeroPago() + 
                    " | Cubre desde " + fechaInicioPeriodo + " hasta " + fechaFinPeriodo);
                break;
            }
        }
        
        if (!tienePagoVigente) {
            throw new Exception("Sus pagos no están al día. El último pago verificado no cubre el período actual. Por favor registre el pago correspondiente al mes en curso.");
        }
        
        return suscripcion;
    }
    
    /**
     * Verifica si una institución tiene suscripción activa (sin lanzar excepción)
     * 
     * @param institucion La institución a verificar
     * @return true si tiene suscripción activa y vigente
     */
    public boolean tieneSuscripcionActiva(Institucion institucion) {
        try {
            validarSuscripcionActiva(institucion);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Obtiene la suscripción activa de una institución si existe
     * 
     * @param institucion La institución
     * @return Optional con la suscripción activa
     */
    public Optional<Suscripciones> obtenerSuscripcionActiva(Institucion institucion) {
        if (institucion == null) {
            return Optional.empty();
        }
        
        Optional<Suscripciones> suscripcionOpt = suscripcionesRepository
            .findSuscripcionActivaByInstitucion(institucion);
        
        if (suscripcionOpt.isPresent()) {
            Suscripciones suscripcion = suscripcionOpt.get();
            LocalDate hoy = LocalDate.now();
            
            // Solo devolver si no está vencida
            if (!suscripcion.getFechaVencimiento().isBefore(hoy)) {
                return suscripcionOpt;
            }
        }
        
        return Optional.empty();
    }
}
