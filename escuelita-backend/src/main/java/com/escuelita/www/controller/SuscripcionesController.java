package com.escuelita.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//Entidades
import com.escuelita.www.entity.CiclosFacturacion;
import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.EstadosSuscripcion;
import com.escuelita.www.entity.Planes;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.entity.SuscripcionesDTO;
//Repositorios
import com.escuelita.www.repository.CiclosFacturacionRepository;
import com.escuelita.www.repository.EstadosSuscripcionRepository;
import com.escuelita.www.repository.PlanesRepository;
import com.escuelita.www.repository.InstitucionRepository;
//Servicios
import com.escuelita.www.service.ISuscripcionesService;

@RestController
@RequestMapping("/restful")
public class SuscripcionesController {

    @Autowired private ISuscripcionesService serviceSuscripciones;
    @Autowired private InstitucionRepository repoInst; // Asumiendo que existe
    @Autowired private PlanesRepository repoPlanes;
    @Autowired private CiclosFacturacionRepository repoCiclos;
    @Autowired private EstadosSuscripcionRepository repoEstados;

    @GetMapping("/suscripciones")
    public List<Suscripciones> buscarTodos() {
        return serviceSuscripciones.buscarTodos();
    }

    @PostMapping("/suscripciones")
    public ResponseEntity<?> guardar(@RequestBody SuscripcionesDTO dto) {
        Suscripciones suscripciones = new Suscripciones();
        suscripciones.setLimiteAlumnosContratado(dto.getLimiteAlumnosContratado());
        suscripciones.setLimiteSedesContratadas(dto.getLimiteSedesContratadas());
        suscripciones.setPrecioAcordado(dto.getPrecioAcordado());
        suscripciones.setFechaInicio(dto.getFechaInicio());
        suscripciones.setFechaVencimiento(dto.getFechaVencimiento());
        

        Institucion institucion = repoInst
            .findById(dto.getIdInstitucion())
            .orElse(null);
        
        
        Planes planes = repoPlanes
            .findById(dto.getIdPlan())
            .orElse(null);
        
        CiclosFacturacion ciclosfacturacion = repoCiclos
            .findById(dto.getIdCiclo())
            .orElse(null);
        
        EstadosSuscripcion estadosSuscripcion = repoEstados
            .findById(dto.getIdEstado())
            .orElse(null);

        suscripciones.setIdInstitucion(institucion);
        suscripciones.setIdPlan(planes);
        suscripciones.setIdCiclo(ciclosfacturacion);
        suscripciones.setIdEstado(estadosSuscripcion);

        return ResponseEntity.ok(serviceSuscripciones.guardar(suscripciones));
    }

    @PutMapping("/suscripciones")
    public ResponseEntity<?> modificar(@RequestBody SuscripcionesDTO dto) {
        if(dto.getIdSuscripcion() == null) {return ResponseEntity.badRequest().body("ID requerido");
       }
        
        Suscripciones suscripciones = new Suscripciones();
        suscripciones.setIdSuscripcion(dto.getIdSuscripcion());
        suscripciones.setLimiteAlumnosContratado(dto.getLimiteAlumnosContratado());
        suscripciones.setLimiteSedesContratadas(dto.getLimiteSedesContratadas());
        suscripciones.setPrecioAcordado(dto.getPrecioAcordado());
        suscripciones.setFechaInicio(dto.getFechaInicio());
        suscripciones.setFechaVencimiento(dto.getFechaVencimiento());
        
        suscripciones.setIdInstitucion(new Institucion(dto.getIdInstitucion()));
        suscripciones.setIdPlan(new Planes(dto.getIdPlan()));
        suscripciones.setIdCiclo(new CiclosFacturacion(dto.getIdCiclo()));
        suscripciones.setIdEstado(new EstadosSuscripcion(dto.getIdEstado()));

        return ResponseEntity.ok(serviceSuscripciones.modificar(suscripciones));
    }

}