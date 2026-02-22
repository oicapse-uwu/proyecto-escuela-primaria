package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.escuelita.www.entity.DeudasAlumno;
import com.escuelita.www.service.IDeudasAlumnoService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class DeudasAlumnoController {
    
    @Autowired
    private IDeudasAlumnoService serviceDeudasAlumno;

    @GetMapping("/deudas-alumno")
    public List<DeudasAlumno> buscartodos() {
        return serviceDeudasAlumno.buscarTodos(); 
    }
    
    @PostMapping("/deudas-alumno")
    public DeudasAlumno guardar(@RequestBody DeudasAlumno deudaAlumno) {
        serviceDeudasAlumno.guardar(deudaAlumno);
        return deudaAlumno;
    }
    
    @PutMapping("/deudas-alumno")
    public DeudasAlumno modificar(@RequestBody DeudasAlumno deudaAlumno) {
        serviceDeudasAlumno.modificar(deudaAlumno);
        return deudaAlumno;
    }
    
    @GetMapping("/deudas-alumno/{id}")
    public Optional<DeudasAlumno> buscarId(@PathVariable("id") Long id) {
        return serviceDeudasAlumno.buscarId(id);
    }
    
    @DeleteMapping("/deudas-alumno/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceDeudasAlumno.eliminar(id);
        return "Deuda de alumno eliminada";
    }   
}