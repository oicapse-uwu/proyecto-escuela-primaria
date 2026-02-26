// Revisado
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

import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.AlumnosDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.TipoDocumentos;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.repository.TipoDocumentosRepository;
import com.escuelita.www.service.IAlumnosService;

@RestController
@RequestMapping("/restful")
public class AlumnosController {

    @Autowired
    private IAlumnosService serviceAlumnos;
    @Autowired
    private TipoDocumentosRepository repoTipoDocumentos;
    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/alumnos")
    public List<Alumnos> buscarTodos() {
        return serviceAlumnos.buscarTodos(); 
    }
    @PostMapping("/alumnos")
    public ResponseEntity<?> guardar(@RequestBody AlumnosDTO dto) {
        Alumnos alumnos = new Alumnos();
        alumnos.setNombres(dto.getNombres());
        alumnos.setApellidos(dto.getApellidos());
        alumnos.setNumeroDocumento(dto.getNumeroDocumento());
        alumnos.setFechaNacimiento(dto.getFechaNacimiento());
        alumnos.setGenero(dto.getGenero());
        alumnos.setDireccion(dto.getDireccion());
        alumnos.setTelefonoContacto(dto.getTelefonoContacto());
        alumnos.setFotoUrl(dto.getFotoUrl());
        alumnos.setObservacionesSalud(dto.getObservacionesSalud());
        alumnos.setTipoIngreso(dto.getTipoIngreso());
        alumnos.setEstadoAlumno(dto.getEstadoAlumno());

        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        TipoDocumentos tipoDocumentos = repoTipoDocumentos
            .findById(dto.getIdTipoDoc())
            .orElse(null);

        alumnos.setIdSede(sedes);
        alumnos.setIdTipoDoc(tipoDocumentos);

        return ResponseEntity.ok(serviceAlumnos.guardar(alumnos));
    }
    @PutMapping("/alumnos")
    public ResponseEntity<?> modificar(@RequestBody AlumnosDTO dto) {
        if(dto.getIdAlumno() == null){
            return ResponseEntity.badRequest()
                    .body("ID de alumno es requerido");
        }
        Alumnos alumnos = new Alumnos();
        alumnos.setIdAlumno(dto.getIdAlumno());
        alumnos.setNombres(dto.getNombres());
        alumnos.setApellidos(dto.getApellidos());
        alumnos.setNumeroDocumento(dto.getNumeroDocumento());
        alumnos.setFechaNacimiento(dto.getFechaNacimiento());
        alumnos.setGenero(dto.getGenero());
        alumnos.setDireccion(dto.getDireccion());
        alumnos.setTelefonoContacto(dto.getTelefonoContacto());
        alumnos.setFotoUrl(dto.getFotoUrl());
        alumnos.setObservacionesSalud(dto.getObservacionesSalud());
        alumnos.setTipoIngreso(dto.getTipoIngreso());
        alumnos.setEstadoAlumno(dto.getEstadoAlumno());

        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        TipoDocumentos tipoDocumentos = repoTipoDocumentos
            .findById(dto.getIdTipoDoc())
            .orElse(null);

        alumnos.setIdSede(sedes);
        alumnos.setIdTipoDoc(tipoDocumentos);

        return ResponseEntity.ok(serviceAlumnos.modificar(alumnos));
    }
    @GetMapping("/alumnos/{id}")
    public Optional<Alumnos> buscarId(@PathVariable("id") Long id){
        return serviceAlumnos.buscarId(id);
    }
    @DeleteMapping("/alumnos/{id}")
    public String eliminar(@PathVariable Long id){
        serviceAlumnos.eliminar(id);
        return "Alumno eliminado correctamente";
    }   
}