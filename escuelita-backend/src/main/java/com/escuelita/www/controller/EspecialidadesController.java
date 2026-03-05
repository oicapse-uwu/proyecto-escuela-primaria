// Sin tocar
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Especialidades;
import com.escuelita.www.service.IEspecialidadesService;

@RestController
@RequestMapping("/restful")
public class EspecialidadesController {
    @Autowired
    private IEspecialidadesService serviceEspecialidades;

    @GetMapping("/especialidades")
    public List<Especialidades> buscarTodos() {
        return serviceEspecialidades.buscarTodos(); 
    }
    @PostMapping("/especialidades")
    public Especialidades guardar(@RequestBody Especialidades especialidades) {
        serviceEspecialidades.guardar(especialidades);
        return especialidades;
    }
    @PutMapping("/especialidades")
    public Especialidades modificar(@RequestBody Especialidades especialidades) {
        serviceEspecialidades.modificar(especialidades);
        return especialidades;
    }
    @GetMapping("/especialidades/{id}")
    public Optional<Especialidades> buscarId(@PathVariable("id") Long id){
        return serviceEspecialidades.buscarId(id);
    }
    @DeleteMapping("/especialidades/{id}")
    public String eliminar(@PathVariable Long id){
        serviceEspecialidades.eliminar(id);
        return "Especialidad eliminada correctamente";
    }
}