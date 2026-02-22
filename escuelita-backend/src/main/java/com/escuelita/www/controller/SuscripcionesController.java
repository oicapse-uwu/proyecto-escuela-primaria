package com.escuelita.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.*;
import com.escuelita.www.repository.*;
import com.escuelita.www.service.ISuscripcionesService;
import java.util.*;

@RestController
@RequestMapping("/restful")
public class SuscripcionesController {

    @Autowired private ISuscripcionesService serviceSuscripciones;
    @Autowired private InstitucionesRepository repoInst; // Asumiendo que existe
    @Autowired private PlanesRepository repoPlanes;
    @Autowired private CiclosFacturacionRepository repoCiclos;
    @Autowired private EstadosSuscripcionRepository repoEstados;

    @GetMapping("/suscripciones")
    public List<Suscripciones> buscartodos() {
        return serviceSuscripciones.buscarTodos();
    }

    @PostMapping("/suscripciones")
    public ResponseEntity<?> guardar(@RequestBody SuscripcionesDTO dto) {
        Suscripciones s = new Suscripciones();
        mapear(s, dto);
        
        s.setIdInstitucion(repoInst.findById(dto.getIdInstitucion()).orElse(null));
        s.setIdPlan(repoPlanes.findById(dto.getIdPlan()).orElse(null));
        s.setIdCiclo(repoCiclos.findById(dto.getIdCiclo()).orElse(null));
        s.setIdEstado(repoEstados.findById(dto.getIdEstado()).orElse(null));

        return ResponseEntity.ok(serviceSuscripciones.guardar(s));
    }

    @PutMapping("/suscripciones")
    public ResponseEntity<?> modificar(@RequestBody SuscripcionesDTO dto) {
        if(dto.getIdSuscripcion() == null) return ResponseEntity.badRequest().body("ID requerido");
        Suscripciones s = new Suscripciones();
        s.setIdSuscripcion(dto.getIdSuscripcion());
        mapear(s, dto);
        
        s.setIdInstitucion(new Instituciones(dto.getIdInstitucion()));
        s.setIdPlan(new Planes(dto.getIdPlan()));
        s.setIdCiclo(new CiclosFacturacion(dto.getIdCiclo()));
        s.setIdEstado(new EstadosSuscripcion(dto.getIdEstado()));

        return ResponseEntity.ok(serviceSuscripciones.modificar(s));
    }

    private void mapear(Suscripciones s, SuscripcionesDTO dto) {
        s.setLimiteAlumnosContratado(dto.getLimiteAlumnosContratado());
        s.setLimiteSedesContratadas(dto.getLimiteSedesContratadas());
        s.setPrecioAcordado(dto.getPrecioAcordado());
        s.setFechaInicio(dto.getFechaInicio());
        s.setFechaVencimiento(dto.getFechaVencimiento());
    }
}