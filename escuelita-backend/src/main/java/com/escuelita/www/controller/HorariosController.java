package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.*;
import com.escuelita.www.repository.*;
import com.escuelita.www.service.IHorariosService;

@RestController
@RequestMapping("/primaria_bd_real")
public class HorariosController {

    @Autowired
    private IHorariosService serviceHorarios;
    @Autowired
    private AsignacionDocenteRepository repoAsignacion;
    @Autowired
    private AulasRepository repoAulas;

    @GetMapping("/horarios")
    public List<Horarios> buscartodos() {
        return serviceHorarios.buscarTodos();
    }

    @PostMapping("/horarios")
    public ResponseEntity<?> guardar(@RequestBody HorariosDTO dto) {
        Horarios horario = new Horarios();
        horario.setDia_semana(dto.getDia_semana());
        horario.setHora_inicio(dto.getHora_inicio());
        horario.setHora_fin(dto.getHora_fin());
        if (dto.getEstado() != null)
            horario.setEstado(dto.getEstado());

        horario.setAsignacion(repoAsignacion.findById(dto.getId_asignacion()).orElse(null));
        horario.setAula(repoAulas.findById(dto.getId_aula()).orElse(null));

        serviceHorarios.guardar(horario);
        return ResponseEntity.ok(horario);
    }

    @PutMapping("/horarios")
    public ResponseEntity<?> modificar(@RequestBody HorariosDTO dto) {
        if (dto.getId_horario() == null) {
            return ResponseEntity.badRequest().body("ID de horario es requerido");
        }
        Horarios horario = new Horarios();
        horario.setId_horario(dto.getId_horario());
        horario.setDia_semana(dto.getDia_semana());
        horario.setHora_inicio(dto.getHora_inicio());
        horario.setHora_fin(dto.getHora_fin());
        if (dto.getEstado() != null)
            horario.setEstado(dto.getEstado());

        horario.setAsignacion(new AsignacionDocente(dto.getId_asignacion()));
        horario.setAula(new Aulas(dto.getId_aula()));

        serviceHorarios.modificar(horario);
        return ResponseEntity.ok(horario);
    }

    @GetMapping("/horarios/{id}")
    public Optional<Horarios> buscarId(@PathVariable("id") Long id) {
        return serviceHorarios.buscarId(id);
    }

    @DeleteMapping("/horarios/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceHorarios.eliminar(id);
        return "Horario eliminado";
    }
}