package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.Horarios;
import com.escuelita.www.service.IHorariosService;

@RestController
@RequestMapping("/restful")
public class HorariosController {

    @Autowired
    private IHorariosService serviceHorarios;

    @GetMapping("/horarios")
    public List<Horarios> buscartodos() {
        return serviceHorarios.buscarTodos();
    }

    @PostMapping("/horarios")
    public Horarios guardar(@RequestBody Horarios horario) {
        serviceHorarios.guardar(horario);
        return horario;
    }

    @PutMapping("/horarios")
    public Horarios modificar(@RequestBody Horarios horario) {
        serviceHorarios.modificar(horario);
        return horario;
    }

    @GetMapping("/horarios/{id}")
    public Optional<Horarios> buscarId(@PathVariable("id") Long id) {
        return serviceHorarios.buscarId(id);
    }

    @DeleteMapping("/horarios/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceHorarios.eliminar(id);
        return "Horario eliminado correctamente";
    }
}