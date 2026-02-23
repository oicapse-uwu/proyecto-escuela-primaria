package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.*;
import com.escuelita.www.repository.*;
import com.escuelita.www.service.IPromediosPeriodoService;

@RestController
@RequestMapping("/restful")
public class PromediosPeriodoController {
    @Autowired
    private IPromediosPeriodoService servicePromedios;
    @Autowired
    private AsignacionDocenteRepository repoAsignacion;
    @Autowired
    private MatriculasRepository repoMatriculas;
    @Autowired
    private PeriodosRepository repoPeriodos;

    @GetMapping("/promediosperiodo")
    public List<PromediosPeriodo> buscartodos() {
        return servicePromedios.buscarTodos();
    }

    @PostMapping("/promediosperiodo")
    public ResponseEntity<?> guardar(@RequestBody PromediosPeriodoDTO dto) {
        PromediosPeriodo prom = new PromediosPeriodo();
        prom.setNota_final_area(dto.getNota_final_area());
        prom.setComentario_libreta(dto.getComentario_libreta());
        prom.setEstado_cierre(dto.getEstado_cierre());

        prom.setId_asignacion(repoAsignacion.findById(dto.getId_asignacion()).orElse(null));
        prom.setId_matricula(repoMatriculas.findById(dto.getId_matricula()).orElse(null));
        prom.setId_periodo(repoPeriodos.findById(dto.getId_periodo()).orElse(null));

        return ResponseEntity.ok(servicePromedios.guardar(prom));
    }

    @PutMapping("/promediosperiodo")
    public ResponseEntity<?> modificar(@RequestBody PromediosPeriodoDTO dto) {
        if(dto.getId_promedio() == null) return ResponseEntity.badRequest().body("ID requerido");
        
        PromediosPeriodo prom = new PromediosPeriodo();
        prom.setId_promedio(dto.getId_promedio());
        prom.setNota_final_area(dto.getNota_final_area());
        prom.setComentario_libreta(dto.getComentario_libreta());
        prom.setEstado_cierre(dto.getEstado_cierre());

        AsignacionDocente ad = new AsignacionDocente(); ad.setId_asignacion(dto.getId_asignacion());
        prom.setId_asignacion(ad);

        Matriculas mat = new Matriculas(); mat.setId_matricula(dto.getId_matricula());
        prom.setId_matricula(mat);

        Periodos per = new Periodos(); per.setId_periodo(dto.getId_periodo());
        prom.setId_periodo(per);

        return ResponseEntity.ok(servicePromedios.modificar(prom));
    }

    @GetMapping("/promediosperiodo/{id}")
    public Optional<PromediosPeriodo> buscarId(@PathVariable Long id) { return servicePromedios.buscarId(id); }

    @DeleteMapping("/promediosperiodo/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePromedios.eliminar(id);
        return "Promedio de periodo eliminado";
    }
}