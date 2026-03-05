/*
    MODIFICADO - Limite de sedes por suscripcion, validacion al crear sede,
    y mensaje de error si se excede el limite de sedes permitidas.
        - Se agregó validación al crear una sede para verificar que la institución 
        tenga una suscripción activa y que no se exceda el límite de sedes permitidas.
        - Si la institución no tiene una suscripción activa, se devuelve un mensaje 
        de error indicando que no puede crear sedes.
        - Si la institución ha alcanzado el límite de sedes permitidas según 
        su suscripción, se devuelve un mensaje de error indicando que ha alcanzado 
        el límite y que debe contactar al administrador para ampliar su suscripción.
*/
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

import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.SedesDTO;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.repository.InstitucionRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.repository.SuscripcionesRepository;
import com.escuelita.www.service.ISedesService;

@RestController
@RequestMapping("/restful")
public class SedesController {

    @Autowired
    private ISedesService serviceSedes;
    @Autowired
    private InstitucionRepository repoInstitucion;
    @Autowired
    private SedesRepository repoSedes;
    @Autowired
    private SuscripcionesRepository repoSuscripciones;

    @GetMapping("/sedes")
    public List<Sedes> buscarTodos() { 
        return serviceSedes.buscarTodos();
    }
    @PostMapping("/sedes")
    public ResponseEntity<?> guardar(@RequestBody SedesDTO dto) {
        try {
            // Obtener la institución
            Institucion institucion = repoInstitucion
                .findById(dto.getIdInstitucion())
                .orElseThrow(() -> new Exception("Institución no encontrada"));
            
            // Validar que exista una suscripción activa
            Optional<Suscripciones> suscripcionOpt = repoSuscripciones
                .findSuscripcionActivaByInstitucionId(dto.getIdInstitucion());
            
            if (suscripcionOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("La institución no tiene una suscripción activa");
            }
            
            Suscripciones suscripcion = suscripcionOpt.get();
            
            // Contar cuántas sedes activas tiene la institución
            Long sedesActuales = repoSedes.countSedesActivasByInstitucionId(dto.getIdInstitucion());
            
            // Validar que no se exceda el límite
            if (sedesActuales >= suscripcion.getLimiteSedesContratadas()) {
                return ResponseEntity.badRequest()
                    .body("Ha alcanzado el límite de sedes permitidas (" + 
                        suscripcion.getLimiteSedesContratadas() + 
                        "). Contacte al administrador para ampliar su suscripción.");
            }
            
            // Crear la sede
            Sedes sedes = new Sedes();
            sedes.setNombreSede(dto.getNombreSede());
            sedes.setCodigoEstablecimiento(dto.getCodigoEstablecimiento());
            sedes.setEsSedePrincipal(dto.getEsSedePrincipal());
            sedes.setDireccion(dto.getDireccion());
            sedes.setDistrito(dto.getDistrito());
            sedes.setProvincia(dto.getProvincia());
            sedes.setDepartamento(dto.getDepartamento());
            sedes.setUgel(dto.getUgel());
            sedes.setTelefono(dto.getTelefono());
            sedes.setCorreoInstitucional(dto.getCorreoInstitucional());
            sedes.setIdInstitucion(institucion);

            return ResponseEntity.ok(serviceSedes.guardar(sedes));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error al crear sede: " + e.getMessage());
        }
    }
    @PutMapping("/sedes")
    public ResponseEntity<?> modificar(@RequestBody SedesDTO dto) {
        if(dto.getIdSede() == null){
            return ResponseEntity.badRequest()
                    .body("ID de sede es requerido");
        }
        Sedes sedes = new Sedes();
        sedes.setIdSede(dto.getIdSede());
        sedes.setNombreSede(dto.getNombreSede());
        sedes.setCodigoEstablecimiento(dto.getCodigoEstablecimiento());
        sedes.setEsSedePrincipal(dto.getEsSedePrincipal());
        sedes.setDireccion(dto.getDireccion());
        sedes.setDistrito(dto.getDistrito());
        sedes.setProvincia(dto.getProvincia());
        sedes.setDepartamento(dto.getDepartamento());
        sedes.setUgel(dto.getUgel());
        sedes.setTelefono(dto.getTelefono());
        sedes.setCorreoInstitucional(dto.getCorreoInstitucional());

        Institucion institucion = repoInstitucion
            .findById(dto.getIdInstitucion())
            .orElse(null);

        sedes.setIdInstitucion(institucion);

        return ResponseEntity.ok(serviceSedes.modificar(sedes));
    }
    @GetMapping("/sedes/{id}")
    public Optional<Sedes> buscarId(@PathVariable("id") Long id){ 
        return serviceSedes.buscarId(id); 
    }
    @DeleteMapping("/sedes/{id}")
    public String eliminar(@PathVariable Long id){
        serviceSedes.eliminar(id);
        return "Sede eliminada correctamente";
    }   
}