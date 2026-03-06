package com.escuelita.www.service.jpa;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.escuelita.www.entity.EstadoVerificacion;
import com.escuelita.www.entity.EstadosSuscripcion;
import com.escuelita.www.entity.MetodosPago;
import com.escuelita.www.entity.PagoSuscripcion;
import com.escuelita.www.entity.PagoSuscripcionDTO;
import com.escuelita.www.entity.SuperAdmins;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.repository.EstadosSuscripcionRepository;
import com.escuelita.www.repository.MetodosPagoRepository;
import com.escuelita.www.repository.PagoSuscripcionRepository;
import com.escuelita.www.repository.SuperAdminsRepository;
import com.escuelita.www.repository.SuscripcionesRepository;
import com.escuelita.www.service.FileStorageService;
import com.escuelita.www.service.IPagoSuscripcionService;

/**
 * Implementación del servicio para gestión de pagos de suscripciones
 */
@Service
public class PagoSuscripcionService implements IPagoSuscripcionService {
    
    @Autowired
    private PagoSuscripcionRepository pagoRepository;
    
    @Autowired
    private SuscripcionesRepository suscripcionRepository;
    
    @Autowired
    private MetodosPagoRepository metodosPagoRepository;
    
    @Autowired
    private SuperAdminsRepository superAdminsRepository;
    
    @Autowired
    private EstadosSuscripcionRepository estadosSuscripcionRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    // ========== CRUD BÁSICO ==========
    
    @Override
    public List<PagoSuscripcion> buscarTodos() {
        return pagoRepository.findAll();
    }
    
    @Override
    public Optional<PagoSuscripcion> buscarId(Long id) {
        return pagoRepository.findById(id);
    }
    
    @Override
    public PagoSuscripcion guardar(PagoSuscripcion pago) {
        return pagoRepository.save(pago);
    }
    
    @Override
    public void eliminar(Long id) {
        pagoRepository.deleteById(id);
    }
    
    // ========== OPERACIONES ESPECÍFICAS ==========
    
    /**
     * Registrar un nuevo pago con comprobante
     */
    @Override
    @Transactional
    public PagoSuscripcion registrarPago(PagoSuscripcionDTO dto, MultipartFile comprobante, Long idSuperAdmin) 
            throws Exception {
        
        // Validar que se proporcionó el comprobante
        if (comprobante == null || comprobante.isEmpty()) {
            throw new Exception("El comprobante es obligatorio");
        }
        
        // Obtener entidades relacionadas
        Suscripciones suscripcion = suscripcionRepository.findById(dto.getIdSuscripcion())
            .orElseThrow(() -> new Exception("Suscripción no encontrada"));
        
        MetodosPago metodoPago = metodosPagoRepository.findById(dto.getIdMetodoPago())
            .orElseThrow(() -> new Exception("Método de pago no encontrado"));
        
        // Guardar comprobante en el servidor
        String nombreArchivo = fileStorageService.guardarComprobanteSuscripcion(comprobante);
        String urlComprobante = fileStorageService.obtenerUrlComprobante(nombreArchivo);
        
        // Crear nuevo pago
        PagoSuscripcion pago = new PagoSuscripcion();
        pago.setSuscripcion(suscripcion);
        pago.setMetodoPago(metodoPago);
        pago.setMontoPagado(dto.getMontoPagado());
        pago.setFechaPago(dto.getFechaPago());
        pago.setNumeroOperacion(dto.getNumeroOperacion());
        pago.setBanco(dto.getBanco());
        pago.setComprobanteUrl(urlComprobante);
        pago.setEstadoVerificacion(EstadoVerificacion.PENDIENTE);
        pago.setObservaciones(dto.getObservaciones());
        pago.setEstado(1); // Activo
        // NOTA: fechaRegistro se establece automáticamente via @PrePersist
        
        // Guardar el pago para obtener el ID
        PagoSuscripcion pagoGuardado = pagoRepository.save(pago);
        
        // Generar número de pago automáticamente
        String numeroPago = String.format("PAGO-%05d", pagoGuardado.getIdPago());
        pagoGuardado.setNumeroPago(numeroPago);
        
        return pagoRepository.save(pagoGuardado);
    }
    
    /**
     * Actualizar un pago programado con comprobante
     */
    @Override
    @Transactional
    public PagoSuscripcion actualizarPagoProgramado(Long idPago, PagoSuscripcionDTO dto, MultipartFile comprobante) 
            throws Exception {
        
        // Validar que se proporcionó el comprobante
        if (comprobante == null || comprobante.isEmpty()) {
            throw new Exception("El comprobante es obligatorio");
        }
        
        // Buscar pago existente
        PagoSuscripcion pago = pagoRepository.findById(idPago)
            .orElseThrow(() -> new Exception("Pago no encontrado"));
        
        // Validar que esté en estado PENDIENTE sin comprobante (pago programado)
        if (pago.getComprobanteUrl() != null) {
            throw new Exception("Este pago ya tiene un comprobante registrado");
        }
        
        // 🆕 VALIDAR QUE NO HAYA PAGOS ANTERIORES PENDIENTES (registro en orden cronológico)
        List<PagoSuscripcion> todosPagos = pagoRepository.findBySuscripcionIdOrderByFechaPagoDesc(pago.getSuscripcion().getIdSuscripcion());
        for (PagoSuscripcion otroPago : todosPagos) {
            // Verificar si hay un pago con fecha anterior que aún no tiene comprobante
            if (otroPago.getFechaPago().isBefore(pago.getFechaPago()) && 
                otroPago.getComprobanteUrl() == null) {
                throw new Exception("No puede registrar este pago. Primero debe registrar el pago correspondiente a " + 
                    otroPago.getFechaPago() + " (" + otroPago.getNumeroPago() + ")");
            }
        }
        
        // Obtener método de pago
        MetodosPago metodoPago = metodosPagoRepository.findById(dto.getIdMetodoPago())
            .orElseThrow(() -> new Exception("Método de pago no encontrado"));
        
        // Guardar comprobante en el servidor
        String nombreArchivo = fileStorageService.guardarComprobanteSuscripcion(comprobante);
        String urlComprobante = fileStorageService.obtenerUrlComprobante(nombreArchivo);
        
        // Actualizar datos del pago
        pago.setMetodoPago(metodoPago);
        pago.setMontoPagado(dto.getMontoPagado());
        pago.setFechaPago(dto.getFechaPago());
        pago.setNumeroOperacion(dto.getNumeroOperacion());
        pago.setBanco(dto.getBanco());
        pago.setComprobanteUrl(urlComprobante);
        if (dto.getObservaciones() != null) {
            pago.setObservaciones(dto.getObservaciones());
        }
        // El estado de verificación permanece PENDIENTE hasta que sea verificado
        
        return pagoRepository.save(pago);
    }
    
    /**
     * Verificar un pago y actualizar estado de suscripción a ACTIVA
     */
    @Override
    @Transactional
    public PagoSuscripcion verificarPago(Long idPago, Long idSuperAdmin) throws Exception {
        
        // Buscar pago
        PagoSuscripcion pago = pagoRepository.findById(idPago)
            .orElseThrow(() -> new Exception("Pago no encontrado"));
        
        // Validar que está en estado PENDIENTE
        if (pago.getEstadoVerificacion() != EstadoVerificacion.PENDIENTE) {
            throw new Exception("Este pago ya ha sido verificado o rechazado");
        }
        
        // Obtener super admin que verifica
        SuperAdmins superAdmin = superAdminsRepository.findById(idSuperAdmin)
            .orElseThrow(() -> new Exception("Super Admin no encontrado"));
        
        // Actualizar pago
        pago.setEstadoVerificacion(EstadoVerificacion.VERIFICADO);
        pago.setVerificadoPor(superAdmin);
        pago.setFechaVerificacion(LocalDateTime.now());
        
        PagoSuscripcion pagoVerificado = pagoRepository.save(pago);
        
        // ========== ACTUALIZAR ESTADO DE SUSCRIPCIÓN A ACTIVA ==========
        Suscripciones suscripcion = pago.getSuscripcion();
        
        // Solo cambiar a Activa si está Pendiente Y el pago verificado cubre el mes actual
        if (suscripcion.getIdEstado().getIdEstado() == 5L) { // 5 = PENDIENTE
            LocalDate hoy = LocalDate.now();
            LocalDate fechaInicioPeriodo = pago.getFechaPago();
            Integer mesesDuracion = suscripcion.getIdCiclo() != null ? suscripcion.getIdCiclo().getMesesDuracion() : 1;
            LocalDate fechaFinPeriodo = fechaInicioPeriodo.plusMonths(mesesDuracion);
            
            // Verificar si el pago verificado cubre el período actual
            boolean cubrePeriodoActual = !hoy.isBefore(fechaInicioPeriodo) && hoy.isBefore(fechaFinPeriodo);
            
            if (cubrePeriodoActual) {
                EstadosSuscripcion estadoActiva = estadosSuscripcionRepository.findById(1L) // 1 = ACTIVA
                    .orElseThrow(() -> new Exception("Estado ACTIVA no encontrado"));
                
                suscripcion.setIdEstado(estadoActiva);
                suscripcionRepository.save(suscripcion);
                System.out.println("✅ Suscripción ID " + suscripcion.getIdSuscripcion() + 
                    " activada tras verificar pago que cubre el período actual (" + 
                    fechaInicioPeriodo + " a " + fechaFinPeriodo + ")");
            } else {
                System.out.println("⚠️ Pago verificado pero NO cubre el período actual. " +
                    "Suscripción permanece en estado Pendiente. " +
                    "Período del pago: " + fechaInicioPeriodo + " a " + fechaFinPeriodo + 
                    " | Hoy: " + hoy);
            }
        }
        
        // TODO: Enviar notificación por email a la institución
        
        return pagoVerificado;
    }
    
    /**
     * Rechazar un pago
     */
    @Override
    @Transactional
    public PagoSuscripcion rechazarPago(Long idPago, String motivo, Long idSuperAdmin) throws Exception {
        
        // Buscar pago
        PagoSuscripcion pago = pagoRepository.findById(idPago)
            .orElseThrow(() -> new Exception("Pago no encontrado"));
        
        // Validar que está en estado PENDIENTE
        if (pago.getEstadoVerificacion() != EstadoVerificacion.PENDIENTE) {
            throw new Exception("Este pago ya ha sido verificado o rechazado");
        }
        
        // Obtener super admin que rechaza
        SuperAdmins superAdmin = superAdminsRepository.findById(idSuperAdmin)
            .orElseThrow(() -> new Exception("Super Admin no encontrado"));
        
        // Actualizar pago
        pago.setEstadoVerificacion(EstadoVerificacion.RECHAZADO);
        pago.setVerificadoPor(superAdmin);
        pago.setFechaVerificacion(LocalDateTime.now());
        
        // Agregar motivo a observaciones
        String observacionesActuales = pago.getObservaciones() != null ? pago.getObservaciones() : "";
        pago.setObservaciones(observacionesActuales + "\n[RECHAZADO] " + motivo);
        
        // La suscripción permanece en estado SUSPENDIDA
        
        // TODO: Enviar notificación por email a la institución
        
        return pagoRepository.save(pago);
    }
    
    /**
     * Generar pagos programados automáticamente según ciclo de facturación
     */
    @Override
    @Transactional
    public int generarPagosProgramados(Long idSuscripcion) throws Exception {
        System.out.println("🔍 Iniciando generación de pagos para suscripción ID: " + idSuscripcion);
        
        // Buscar suscripción
        Suscripciones suscripcion = suscripcionRepository.findById(idSuscripcion)
            .orElseThrow(() -> new Exception("Suscripción no encontrada"));
        
        System.out.println("✅ Suscripción encontrada: " + suscripcion.getIdSuscripcion());
        
        // Verificar que tenga ciclo de facturación
        if (suscripcion.getIdCiclo() == null) {
            throw new Exception("La suscripción no tiene ciclo de facturación definido");
        }
        
        System.out.println("✅ Ciclo de facturación: " + suscripcion.getIdCiclo().getNombre() + " (" + suscripcion.getIdCiclo().getMesesDuracion() + " meses)");
        
        // Eliminar pagos anteriores pendientes de esta suscripción (si existen)
        List<PagoSuscripcion> pagosPendientesAnteriores = pagoRepository.findBySuscripcionIdAndEstadoVerificacion(
            idSuscripcion, EstadoVerificacion.PENDIENTE
        );
        if (!pagosPendientesAnteriores.isEmpty()) {
            System.out.println("🗑️ Eliminando " + pagosPendientesAnteriores.size() + " pagos pendientes anteriores");
            pagoRepository.deleteAll(pagosPendientesAnteriores);
        }
        
        LocalDate fechaInicio = suscripcion.getFechaInicio();
        LocalDate fechaVencimiento = suscripcion.getFechaVencimiento();
        Integer mesesDuracion = suscripcion.getIdCiclo().getMesesDuracion();
        
        System.out.println("📅 Fecha inicio: " + fechaInicio);
        System.out.println("📅 Fecha vencimiento: " + fechaVencimiento);
        System.out.println("📆 Meses duración ciclo: " + mesesDuracion);
        
        if (fechaInicio == null || fechaVencimiento == null || mesesDuracion == null) {
            throw new Exception("Datos incompletos en la suscripción");
        }
        
        // Calcular número total de pagos
        // Agregar 1 día a fechaVencimiento para incluir el mes completo
        LocalDate fechaVencimientoAjustada = fechaVencimiento.plusDays(1);
        long mesesTotales = java.time.temporal.ChronoUnit.MONTHS.between(fechaInicio, fechaVencimientoAjustada);
        int numeroPagos = (int) Math.ceil((double) mesesTotales / mesesDuracion);
        
        System.out.println("🧮 Meses totales (con ajuste): " + mesesTotales);
        System.out.println("🧮 Número de pagos a generar: " + numeroPagos);
        
        if (numeroPagos <= 0) {
            numeroPagos = 1; // Al menos un pago
            System.out.println("⚠️ Ajustando a mínimo 1 pago");
        }
        
        // Generar los pagos programados
        int pagosGenerados = 0;
        LocalDate fechaPagoActual = fechaInicio;
        
        System.out.println("🔄 Iniciando generación de pagos...");
        
        for (int i = 0; i < numeroPagos; i++) {
            System.out.println("➡️ Generando pago " + (i + 1) + " de " + numeroPagos + " | Fecha: " + fechaPagoActual);
            
            // Crear pago programado (sin comprobante)
            PagoSuscripcion pago = new PagoSuscripcion();
            pago.setSuscripcion(suscripcion);
            pago.setMontoPagado(suscripcion.getPrecioAcordado());
            pago.setFechaPago(fechaPagoActual);
            pago.setEstadoVerificacion(EstadoVerificacion.PENDIENTE);
            pago.setEstado(1);
            pago.setObservaciones("Pago programado automáticamente - Período " + (i + 1) + " de " + numeroPagos);
            // El método de pago y comprobante se agregarán cuando se registre el pago real
            
            try {
                // Guardar el pago para obtener el ID
                PagoSuscripcion pagoGuardado = pagoRepository.save(pago);
                System.out.println("   ✅ Pago guardado con ID: " + pagoGuardado.getIdPago());
                
                // Generar número de pago automáticamente
                String numeroPago = String.format("PAGO-%05d", pagoGuardado.getIdPago());
                pagoGuardado.setNumeroPago(numeroPago);
                pagoRepository.save(pagoGuardado);
                System.out.println("   ✅ Número de pago asignado: " + numeroPago);
                
                pagosGenerados++;
            } catch (Exception e) {
                System.err.println("   ❌ Error al guardar pago: " + e.getMessage());
                e.printStackTrace();
                throw new Exception("Error al crear pago " + (i + 1) + ": " + e.getMessage());
            }
            
            // Calcular siguiente fecha de pago
            fechaPagoActual = fechaPagoActual.plusMonths(mesesDuracion);
            
            // No generar pagos más allá de la fecha de vencimiento
            if (fechaPagoActual.isAfter(fechaVencimiento)) {
                System.out.println("⏹️ Deteniendo generación: siguiente fecha (" + fechaPagoActual + ") supera el vencimiento (" + fechaVencimiento + ")");
                break;
            }
        }
        
        System.out.println("✅ Generación completada: " + pagosGenerados + " pagos creados");
        return pagosGenerados;
    }
    
    // ========== CONSULTAS ==========
    
    @Override
    public List<PagoSuscripcion> obtenerPagosPorSuscripcion(Long idSuscripcion) {
        return pagoRepository.findBySuscripcionIdOrderByFechaPagoDesc(idSuscripcion);
    }
    
    @Override
    public List<PagoSuscripcion> obtenerPagosPorEstado(EstadoVerificacion estado) {
        return pagoRepository.findByEstadoVerificacion(estado);
    }
    
    @Override
    public List<PagoSuscripcion> obtenerPagosPendientes() {
        return pagoRepository.findPagosPendientes();
    }
    
    @Override
    public List<PagoSuscripcion> obtenerPagosPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        return pagoRepository.findByFechaPagoBetween(fechaInicio, fechaFin);
    }
    
    // ========== CONVERSIÓN A DTO ==========
    
    @Override
    public PagoSuscripcionDTO convertirADTO(PagoSuscripcion pago) {
        PagoSuscripcionDTO dto = new PagoSuscripcionDTO();
        
        // Datos básicos
        dto.setIdPago(pago.getIdPago());
        dto.setNumeroPago(pago.getNumeroPago());
        dto.setMontoPagado(pago.getMontoPagado());
        dto.setFechaPago(pago.getFechaPago());
        dto.setNumeroOperacion(pago.getNumeroOperacion());
        dto.setBanco(pago.getBanco());
        dto.setComprobanteUrl(pago.getComprobanteUrl());
        dto.setEstadoVerificacion(pago.getEstadoVerificacion().toString());
        dto.setObservaciones(pago.getObservaciones());
        dto.setFechaRegistro(pago.getFechaRegistro());
        dto.setFechaVerificacion(pago.getFechaVerificacion());
        dto.setEstado(pago.getEstado());
        
        // IDs de relaciones
        dto.setIdSuscripcion(pago.getSuscripcion().getIdSuscripcion());
        dto.setIdMetodoPago(pago.getMetodoPago() != null ? pago.getMetodoPago().getIdMetodo() : null);
        
        // Datos expandidos para UI
        if (pago.getSuscripcion() != null) {
            if (pago.getSuscripcion().getIdInstitucion() != null) {
                dto.setNombreInstitucion(pago.getSuscripcion().getIdInstitucion().getNombre());
                dto.setCodModularInstitucion(pago.getSuscripcion().getIdInstitucion().getCodModular());
            }
            if (pago.getSuscripcion().getIdPlan() != null) {
                dto.setPlanNombre(pago.getSuscripcion().getIdPlan().getNombrePlan());
            }
            dto.setMontoSuscripcion(pago.getSuscripcion().getPrecioAcordado());
        }
        
        if (pago.getMetodoPago() != null) {
            dto.setNombreMetodoPago(pago.getMetodoPago().getNombreMetodo());
        }
        
        if (pago.getVerificadoPor() != null) {
            dto.setIdVerificadoPor(pago.getVerificadoPor().getIdAdmin());
            dto.setNombreVerificadoPor(pago.getVerificadoPor().getNombres() + " " + 
                                      pago.getVerificadoPor().getApellidos());
        }
        
        return dto;
    }
    
    @Override
    public List<PagoSuscripcionDTO> convertirListaADTO(List<PagoSuscripcion> pagos) {
        return pagos.stream()
                   .map(this::convertirADTO)
                   .collect(Collectors.toList());
    }
}
