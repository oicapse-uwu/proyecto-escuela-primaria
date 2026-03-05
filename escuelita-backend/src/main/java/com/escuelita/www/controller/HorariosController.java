// Sin tocar
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
    private AsignacionDocenteRepository repoAsignacionDocente;
    @Autowired
    private AulasRepository repoAulas;

    @GetMapping("/horarios")
    public List<Horarios> buscarTodos() {
        return serviceHorarios.buscarTodos();
    }
    @PostMapping("/horarios")
    public ResponseEntity<?> guardar(@RequestBody HorariosDTO dto) {
        Horarios horarios = new Horarios();
        horarios.setDiaSemana(dto.getDiaSemana());
        horarios.setHoraInicio(dto.getHoraInicio());
        horarios.setHoraFin(dto.getHoraFin());

        AsignacionDocente asignacionDocente = repoAsignacionDocente
            .findById(dto.getIdAsignacion())
            .orElse(null);
        Aulas aulas = repoAulas
            .findById(dto.getIdAula())
            .orElse(null);
        
        horarios.setIdAsignacion(asignacionDocente);
        horarios.setIdAula(aulas);

        return ResponseEntity.ok(serviceHorarios.guardar(horarios));
    }
    @PutMapping("/horarios")
    public ResponseEntity<?> modificar(@RequestBody HorariosDTO dto) {
        if (dto.getIdHorario() == null) {
            return ResponseEntity.badRequest()
                    .body("ID de horario es requerido");
        }
        Horarios horarios = new Horarios();
        horarios.setIdHorario(dto.getIdHorario());
        horarios.setDiaSemana(dto.getDiaSemana());
        horarios.setHoraInicio(dto.getHoraInicio());
        horarios.setHoraFin(dto.getHoraFin());

        AsignacionDocente asignacionDocente = repoAsignacionDocente
            .findById(dto.getIdAsignacion())
            .orElse(null);
        Aulas aulas = repoAulas
            .findById(dto.getIdAula())
            .orElse(null);

        horarios.setIdAsignacion(asignacionDocente);
        horarios.setIdAula(aulas);

        return ResponseEntity.ok(serviceHorarios.modificar(horarios));
    }
    @GetMapping("/horarios/{id}")
    public Optional<Horarios> buscarId(@PathVariable("id") Long id) {
        return serviceHorarios.buscarId(id);
    }
    @DeleteMapping("/horarios/{id}")
    public String eliminar(@PathVariable Long id){
        serviceHorarios.eliminar(id);
        return "Horario eliminado correctamente";
    }
}