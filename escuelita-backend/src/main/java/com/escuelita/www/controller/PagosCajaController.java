// No modificado
package com.escuelita.www.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.DeudasAlumno;
import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.entity.MetodosPago;
import com.escuelita.www.entity.PagoDetalle;
import com.escuelita.www.entity.PagoDetalleDTO;
import com.escuelita.www.entity.PagosCaja;
import com.escuelita.www.entity.PagosCajaDTO;
import com.escuelita.www.entity.Usuarios;
import com.escuelita.www.repository.DeudasAlumnoRepository;
import com.escuelita.www.repository.MatriculasRepository;
import com.escuelita.www.repository.MetodosPagoRepository;
import com.escuelita.www.repository.UsuariosRepository;
import com.escuelita.www.security.RequireModulo;
import com.escuelita.www.service.IPagoDetalleService;
import com.escuelita.www.service.IPagosCajaService;

@RestController
@RequestMapping("/restful")
public class PagosCajaController {
    
    @Autowired
    private IPagosCajaService servicePagosCaja;
    @Autowired
    private IPagoDetalleService servicePagoDetalle;
    @Autowired
    private MetodosPagoRepository repoMetodosPago;
    @Autowired
    private UsuariosRepository repoUsuarios;
    @Autowired
    private DeudasAlumnoRepository repoDeudasAlumno;
    @Autowired
    private MatriculasRepository repoMatriculas;

    @GetMapping("/pagoscaja")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public List<PagosCaja> buscarTodos() {
        return servicePagosCaja.buscarTodos();  
    }
    @PostMapping("/pagoscaja")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public ResponseEntity<?> guardar(@RequestBody PagosCajaDTO dto) {
        try {
            PagosCaja pagosCaja = new PagosCaja();
            pagosCaja.setFechaPago(dto.getFechaPago());
            pagosCaja.setMontoTotalPagado(dto.getMontoTotalPagado());
            pagosCaja.setComprobanteNumero(dto.getComprobanteNumero());
            pagosCaja.setObservacionPago(dto.getObservacionPago());

            MetodosPago metodosPago = repoMetodosPago
                .findById(dto.getIdMetodo())
                .orElse(null);
            Usuarios usuarios = repoUsuarios
                .findById(dto.getIdUsuario())
                .orElse(null);

            pagosCaja.setIdMetodo(metodosPago);
            pagosCaja.setIdUsuario(usuarios);

            PagosCaja savedPago = servicePagosCaja.guardar(pagosCaja);

            // Guardar detalles + marcar deudas como pagadas
            if (dto.getDetalles() != null) {
                for (PagoDetalleDTO detalleDto : dto.getDetalles()) {
                    DeudasAlumno deuda = repoDeudasAlumno.findById(detalleDto.getIdDeuda()).orElse(null);
                    if (deuda == null) continue;

                    PagoDetalle detalle = new PagoDetalle();
                    detalle.setMontoAplicado(detalleDto.getMontoAplicado());
                    detalle.setIdPago(savedPago);
                    detalle.setIdDeuda(deuda);
                    servicePagoDetalle.guardar(detalle);

                    // Marcar deuda como Pagada
                    deuda.setEstadoDeuda("Pagada");
                    deuda.setFechaPagoTotal(LocalDateTime.now());
                    repoDeudasAlumno.save(deuda);

                    // Si todas las deudas de la matrícula están pagadas → activar matrícula
                    if (deuda.getIdMatricula() != null) {
                        Long idMatricula = deuda.getIdMatricula().getIdMatricula();
                        List<DeudasAlumno> todasDeudas = repoDeudasAlumno.findByIdMatricula_IdMatricula(idMatricula);
                        boolean todasPagadas = todasDeudas.stream()
                            .allMatch(d -> "Pagada".equals(d.getEstadoDeuda()));
                        if (todasPagadas) {
                            Matriculas matricula = repoMatriculas.findById(idMatricula).orElse(null);
                            if (matricula != null) {
                                matricula.setEstadoMatricula("Activa");
                                matricula.setFechaPagoMatricula(LocalDateTime.now());
                                repoMatriculas.save(matricula);
                            }
                        }
                    }
                }
            }

            return ResponseEntity.ok(savedPago);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/pagoscaja")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public ResponseEntity<?> modificar(@RequestBody PagosCajaDTO dto) {
        if(dto.getIdPago() == null){
            return ResponseEntity.badRequest()
                    .body("ID de pago es requerido");
        }
        PagosCaja pagosCaja = new PagosCaja();
        pagosCaja.setIdPago(dto.getIdPago());
        pagosCaja.setFechaPago(dto.getFechaPago());
        pagosCaja.setMontoTotalPagado(dto.getMontoTotalPagado());
        pagosCaja.setComprobanteNumero(dto.getComprobanteNumero());
        pagosCaja.setObservacionPago(dto.getObservacionPago());

        MetodosPago metodosPago = repoMetodosPago
            .findById(dto.getIdMetodo())
            .orElse(null);
        Usuarios usuarios = repoUsuarios
            .findById(dto.getIdUsuario())
            .orElse(null);

        pagosCaja.setIdMetodo(metodosPago);
        pagosCaja.setIdUsuario(usuarios);

        return ResponseEntity.ok(servicePagosCaja.modificar(pagosCaja));
    }
    @GetMapping("/pagoscaja/{id}")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public Optional<PagosCaja> buscarId(@PathVariable("id") Long id){
        return servicePagosCaja.buscarId(id);
    }
    
    @DeleteMapping("/pagoscaja/{id}")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public String eliminar(@PathVariable Long id) {
        servicePagosCaja.eliminar(id);
        return "Pago eliminado correctamente";
    }   
}