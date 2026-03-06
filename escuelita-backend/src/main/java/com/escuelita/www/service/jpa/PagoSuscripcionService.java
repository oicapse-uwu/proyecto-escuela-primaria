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
        // NOTA: numeroPago se genera automáticamente via trigger en DB
        
        return pagoRepository.save(pago);
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
        EstadosSuscripcion estadoActiva = estadosSuscripcionRepository.findById(1L) // 1 = ACTIVA
            .orElseThrow(() -> new Exception("Estado ACTIVA no encontrado"));
        
        suscripcion.setIdEstado(estadoActiva);
        suscripcionRepository.save(suscripcion);
        
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
        // Buscar suscripción
        Suscripciones suscripcion = suscripcionRepository.findById(idSuscripcion)
            .orElseThrow(() -> new Exception("Suscripción no encontrada"));
        
        // Verificar que tenga ciclo de facturación
        if (suscripcion.getIdCiclo() == null) {
            throw new Exception("La suscripción no tiene ciclo de facturación definido");
        }
        
        // Eliminar pagos anteriores pendientes de esta suscripción (si existen)
        List<PagoSuscripcion> pagosPendientesAnteriores = pagoRepository.findBySuscripcionIdAndEstadoVerificacion(
            idSuscripcion, EstadoVerificacion.PENDIENTE
        );
        pagoRepository.deleteAll(pagosPendientesAnteriores);
        
        LocalDate fechaInicio = suscripcion.getFechaInicio();
        LocalDate fechaVencimiento = suscripcion.getFechaVencimiento();
        Integer mesesDuracion = suscripcion.getIdCiclo().getMesesDuracion();
        
        if (fechaInicio == null || fechaVencimiento == null || mesesDuracion == null) {
            throw new Exception("Datos incompletos en la suscripción");
        }
        
        // Calcular número total de pagos
        long mesesTotales = java.time.temporal.ChronoUnit.MONTHS.between(fechaInicio, fechaVencimiento);
        int numeroPagos = (int) Math.ceil((double) mesesTotales / mesesDuracion);
        
        if (numeroPagos <= 0) {
            numeroPagos = 1; // Al menos un pago
        }
        
        // Generar los pagos programados
        int pagosGenerados = 0;
        LocalDate fechaPagoActual = fechaInicio;
        
        for (int i = 0; i < numeroPagos; i++) {
            // Crear pago programado (sin comprobante)
            PagoSuscripcion pago = new PagoSuscripcion();
            pago.setSuscripcion(suscripcion);
            pago.setMontoPagado(suscripcion.getPrecioAcordado());
            pago.setFechaPago(fechaPagoActual);
            pago.setEstadoVerificacion(EstadoVerificacion.PENDIENTE);
            pago.setEstado(1);
            pago.setObservaciones("Pago programado automáticamente - Período " + (i + 1) + " de " + numeroPagos);
            // El método de pago y comprobante se agregarán cuando se registre el pago real
            
            pagoRepository.save(pago);
            pagosGenerados++;
            
            // Calcular siguiente fecha de pago
            fechaPagoActual = fechaPagoActual.plusMonths(mesesDuracion);
            
            // No generar pagos más allá de la fecha de vencimiento
            if (fechaPagoActual.isAfter(fechaVencimiento)) {
                break;
            }
        }
        
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
        dto.setIdMetodoPago(pago.getMetodoPago().getIdMetodo());
        
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
