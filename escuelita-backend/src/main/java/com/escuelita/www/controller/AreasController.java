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

import com.escuelita.www.entity.Areas;
import com.escuelita.www.entity.AreasDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.IAreasService;

@RestController
@RequestMapping("/restful")
public class AreasController {

    @Autowired
    private IAreasService serviceAreas;
    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/areas")
    public List<Areas> buscarTodos() {
        return serviceAreas.buscarTodos();
    }
    @PostMapping("/areas")
    public ResponseEntity<?> guardar(@RequestBody AreasDTO dto) {
        Areas areas = new Areas();
        areas.setNombreArea(dto.getNombreArea());
        areas.setDescripcion(dto.getDescripcion());

        Sedes sedes = repoSedes
                .findById(dto.getIdSede())
                .orElse(null);

        areas.setIdSede(sedes);

        return ResponseEntity.ok(serviceAreas.guardar(areas));
    }
    @PutMapping("/areas")
    public ResponseEntity<?> modificar(@RequestBody AreasDTO dto) {
        if (dto.getIdArea() == null) {
            return ResponseEntity.badRequest()
                    .body("ID de área es requerido");
        }
        Areas areas = new Areas();
        areas.setIdArea(dto.getIdArea());
        areas.setNombreArea(dto.getNombreArea());
        areas.setDescripcion(dto.getDescripcion());

        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);

        areas.setIdSede(sedes);

        return ResponseEntity.ok(serviceAreas.modificar(areas));
    }
    @GetMapping("/areas/{id}")
    public Optional<Areas> buscarId(@PathVariable("id") Long id) {
        return serviceAreas.buscarId(id);
    }
    @DeleteMapping("/areas/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceAreas.eliminar(id);
        return "Área eliminada correctamente";
    }
}