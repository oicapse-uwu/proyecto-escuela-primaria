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
    private SedesRepository repoSedes; // Repositorio inyectado para el POST

    @GetMapping("/areas")
    public List<Areas> buscarTodos() {
        return serviceAreas.buscarTodos();
    }

    @PostMapping("/areas")
    public ResponseEntity<?> guardar(@RequestBody AreasDTO dto) {
        Areas area = new Areas();
        area.setNombreArea(dto.getNombreArea());
        area.setDescripcion(dto.getDescripcion());
        if (dto.getEstado() != null)
            area.setEstado(dto.getEstado());

        // Buscando la relación
        Sedes sede = repoSedes
                .findById(dto.getIdSede())
                .orElse(null);

        area.setSede(sede);

        serviceAreas.guardar(area);
        return ResponseEntity.ok(area);
    }

    @PutMapping("/areas")
    public ResponseEntity<?> modificar(@RequestBody AreasDTO dto) {
        if (dto.getIdArea() == null) {
            return ResponseEntity.badRequest()
                    .body("ID de área es requerido");
        }
        Areas area = new Areas();
        area.setIdArea(dto.getIdArea());
        area.setNombreArea(dto.getNombreArea());
        area.setDescripcion(dto.getDescripcion());
        if (dto.getEstado() != null)
            area.setEstado(dto.getEstado());

        // Instanciando la relación con el constructor de ID
        area.setSede(new Sedes(dto.getIdSede()));

        serviceAreas.modificar(area);
        return ResponseEntity.ok(area);
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