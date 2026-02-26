package com.escuelita.www.controller;

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

import com.escuelita.www.entity.PagoDetalle;
import com.escuelita.www.entity.PagoDetalleDTO;
import com.escuelita.www.entity.PagosCaja;
import com.escuelita.www.entity.DeudasAlumno;
import com.escuelita.www.repository.PagosCajaRepository;
import com.escuelita.www.repository.DeudasAlumnoRepository;

import com.escuelita.www.service.IPagoDetalleService;

@RestController
@RequestMapping("/restful")
public class PagoDetalleController {
    
    @Autowired
    private IPagoDetalleService servicePagoDetalle;
    @Autowired
    private PagosCajaRepository repoPagosCaja;
    @Autowired
    private DeudasAlumnoRepository repoDeudasAlumno;

    @GetMapping("/pagodetalle")
    public List<PagoDetalle> buscarTodos() {
        return servicePagoDetalle.buscarTodos(); 
    }
    @PostMapping("/pagodetalle")
    public ResponseEntity<?> guardar(@RequestBody PagoDetalleDTO dto) {
        PagoDetalle pagoDetalle = new PagoDetalle();
        pagoDetalle.setMontoAplicado(dto.getMontoAplicado());

        PagosCaja pagosCaja = repoPagosCaja
            .findById(dto.getIdPago())
            .orElse(null);
        DeudasAlumno deudasAlumno = repoDeudasAlumno
            .findById(dto.getIdDeuda())
            .orElse(null);

        pagoDetalle.setIdPago(pagosCaja);
        pagoDetalle.setIdDeuda(deudasAlumno);

        return ResponseEntity.ok(servicePagoDetalle.guardar(pagoDetalle));
    }
    @PutMapping("/pagodetalle")
    public ResponseEntity<?> modificar(@RequestBody PagoDetalleDTO dto) {
        if(dto.getIdPagoDetalle() == null){
            return ResponseEntity.badRequest()
                    .body("ID de detalle de pago es requerido");
        }
        PagoDetalle pagoDetalle = new PagoDetalle();
        pagoDetalle.setIdPagoDetalle(dto.getIdPagoDetalle());
        pagoDetalle.setMontoAplicado(dto.getMontoAplicado());

        PagosCaja pagosCaja = repoPagosCaja
            .findById(dto.getIdPago())
            .orElse(null);
        DeudasAlumno deudasAlumno = repoDeudasAlumno
            .findById(dto.getIdDeuda())
            .orElse(null);

        pagoDetalle.setIdPago(pagosCaja);
        pagoDetalle.setIdDeuda(deudasAlumno);

        return ResponseEntity.ok(servicePagoDetalle.modificar(pagoDetalle   ));    
    }
    @GetMapping("/pagodetalle/{id}")
    public Optional<PagoDetalle> buscarId(@PathVariable("id") Long id){
    return servicePagoDetalle.buscarId(id);
    }
    @DeleteMapping("/pagodetalle/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePagoDetalle.eliminar(id);
        return "Detalle de pago eliminado correctamente";
    }   
}