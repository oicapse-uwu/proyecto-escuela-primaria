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
import com.escuelita.www.entity.TipoDocumentos;
import com.escuelita.www.entity.Sedes;

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
    public List<Alumnos> buscartodos() {
        return serviceAlumnos.buscarTodos(); 
    }
    @PostMapping("/alumnos")
    public ResponseEntity<?> guardar(@RequestBody AlumnosDTO dto) {
        Alumnos alumno = new Alumnos();
        alumno.setNombres(dto.getNombres());
        alumno.setApellidos(dto.getApellidos());
        alumno.setNumero_documento(dto.getNumero_documento());
        alumno.setFecha_nacimiento(dto.getFecha_nacimiento());
        alumno.setGenero(dto.getGenero());
        alumno.setDireccion(dto.getDireccion());
        alumno.setTelefono_contacto(dto.getTelefono_contacto());
        alumno.setFoto_url(dto.getFoto_url());
        alumno.setObservaciones_salud(dto.getObservaciones_salud());
        alumno.setTipo_ingreso(dto.getTipo_ingreso());
        alumno.setEstado_alumno(dto.getEstado_alumno());

        Sedes sede = repoSedes
            .findById(dto.getId_sede())
            .orElse(null);
        TipoDocumentos tipo = repoTipoDocumentos
            .findById(dto.getId_tipo_doc())
            .orElse(null);
        
        alumno.setId_sede(sede);
        alumno.setId_tipo_doc(tipo);

        return ResponseEntity.ok(serviceAlumnos.guardar(alumno));
    }
    @PutMapping("/alumnos")
    public ResponseEntity<?> modificar(@RequestBody AlumnosDTO dto) {
        if(dto.getId_alumno() == null){
            return ResponseEntity.badRequest()
                    .body("ID de alumno es requerido");
        }
        Alumnos alumno = new Alumnos();
        alumno.setId_alumno(dto.getId_alumno());
        alumno.setNombres(dto.getNombres());
        alumno.setApellidos(dto.getApellidos());
        alumno.setNumero_documento(dto.getNumero_documento());
        alumno.setFecha_nacimiento(dto.getFecha_nacimiento());
        alumno.setGenero(dto.getGenero());
        alumno.setDireccion(dto.getDireccion());
        alumno.setTelefono_contacto(dto.getTelefono_contacto());
        alumno.setFoto_url(dto.getFoto_url());
        alumno.setObservaciones_salud(dto.getObservaciones_salud());
        alumno.setTipo_ingreso(dto.getTipo_ingreso());

        alumno.setId_sede(new Sedes(dto.getId_sede()));
        alumno.setId_tipo_doc(new TipoDocumentos(dto.getId_tipo_doc()));

        return ResponseEntity.ok(serviceAlumnos.modificar(alumno));
    }
    @GetMapping("/alumnos/{id}")
    public Optional<Alumnos> buscarId(@PathVariable("id") Long id){
        return serviceAlumnos.buscarId(id);
    }
    @DeleteMapping("/alumnos/{id}")
    public String eliminar(@PathVariable Long id){
        serviceAlumnos.eliminar(id);
        return "Alumno eliminado";
    }   
}