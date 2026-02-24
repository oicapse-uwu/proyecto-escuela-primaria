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

import com.escuelita.www.entity.AsignacionDocente;
import com.escuelita.www.entity.Aulas;
import com.escuelita.www.entity.Horarios;
import com.escuelita.www.entity.HorariosDTO;
import com.escuelita.www.repository.AsignacionDocenteRepository;
import com.escuelita.www.repository.AulasRepository;
import com.escuelita.www.service.IHorariosService;

@RestController
@RequestMapping("/restful")
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
        horario.setDiaSemana(dto.getDiaSemana());
        horario.setHoraInicio(dto.getHoraInicio());
        horario.setHoraFin(dto.getHoraFin());
        if (dto.getEstado() != null)
            horario.setEstado(dto.getEstado());

        horario.setAsignacion(repoAsignacion.findById(dto.getIdAsignacion()).orElse(null));
        horario.setAula(repoAulas.findById(dto.getIdAula()).orElse(null));

        serviceHorarios.guardar(horario);
        return ResponseEntity.ok(horario);
    }

    @PutMapping("/horarios")
    public ResponseEntity<?> modificar(@RequestBody HorariosDTO dto) {
        if (dto.getIdHorario() == null) {
            return ResponseEntity.badRequest().body("ID de horario es requerido");
        }
        Horarios horario = new Horarios();
        horario.setIdHorario(dto.getIdHorario());
        horario.setDiaSemana(dto.getDiaSemana());
        horario.setHoraInicio(dto.getHoraInicio());
        horario.setHoraFin(dto.getHoraFin());
        if (dto.getEstado() != null)
            horario.setEstado(dto.getEstado());

        horario.setAsignacion(new AsignacionDocente(dto.getIdAsignacion()));
        horario.setAula(new Aulas(dto.getIdAula()));

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