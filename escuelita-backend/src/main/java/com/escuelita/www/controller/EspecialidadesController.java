package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.Especialidades;
import com.escuelita.www.service.IEspecialidadesService;

@RestController
@RequestMapping("/restful")
public class EspecialidadesController {

    @Autowired
    private IEspecialidadesService serviceEspecialidades;

    @GetMapping("/especialidades")
    public List<Especialidades> buscartodos() {
        return serviceEspecialidades.buscarTodos();
    }

    @PostMapping("/especialidades")
    public Especialidades guardar(@RequestBody Especialidades especialidad) {
        serviceEspecialidades.guardar(especialidad);
        return especialidad;
    }

    @PutMapping("/especialidades")
    public Especialidades modificar(@RequestBody Especialidades especialidad) {
        serviceEspecialidades.modificar(especialidad);
        return especialidad;
    }

    @GetMapping("/especialidades/{id}")
    public Optional<Especialidades> buscarId(@PathVariable("id") Long id) {
        return serviceEspecialidades.buscarId(id);
    }

    @DeleteMapping("/especialidades/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceEspecialidades.eliminar(id);
        return "Especialidad eliminada correctamente";
    }
}