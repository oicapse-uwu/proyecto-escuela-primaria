package com.escuelita.www.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.DeudasAlumnoDTO;
import com.escuelita.www.service.IDeudasAlumnoService;

@RestController
@RequestMapping("/restful")
public class DeudasAlumnoController {
    
    @Autowired
    private IDeudasAlumnoService serviceDeudas;

    @GetMapping("/deudas-alumno")
    public List<DeudasAlumnoDTO> buscartodos() {
        return serviceDeudas.buscarTodos(); 
    }
    
    @PostMapping("/deudas-alumno")
    public DeudasAlumnoDTO guardar(@RequestBody DeudasAlumnoDTO dto) {
        return serviceDeudas.guardar(dto);
    }
    
    @PutMapping("/deudas-alumno")
    public DeudasAlumnoDTO modificar(@RequestBody DeudasAlumnoDTO dto) {
        return serviceDeudas.modificar(dto);
    }
    
    @GetMapping("/deudas-alumno/{id}")
    public DeudasAlumnoDTO buscarId(@PathVariable("id") Long id) {
        return serviceDeudas.buscarId(id);
    }
    
    @DeleteMapping("/deudas-alumno/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceDeudas.eliminar(id);
        return "Deuda de alumno eliminada correctamente";
    }   
}