// Sin tocar
package com.escuelita.www.controller;

import java.util.List;

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
import com.escuelita.www.security.RequireModulo;
import com.escuelita.www.service.IAreasService;

@RestController
@RequestMapping("/restful")
public class AreasController {

    @Autowired
    private IAreasService serviceAreas;

    @GetMapping("/areas")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public List<Areas> buscarTodos() {
        // Las áreas son globales, se devuelven todas
        return serviceAreas.buscarTodos();
    }
    @PostMapping("/areas")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public ResponseEntity<?> guardar(@RequestBody AreasDTO dto) {
        // Las áreas son globales, no se asignan a ninguna sede
        Areas areas = new Areas();
        areas.setNombreArea(dto.getNombreArea());
        areas.setDescripcion(dto.getDescripcion());

        return ResponseEntity.ok(serviceAreas.guardar(areas));
    }
    @PutMapping("/areas")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public ResponseEntity<?> modificar(@RequestBody AreasDTO dto) {
        if (dto.getIdArea() == null) {
            return ResponseEntity.badRequest()
                    .body("ID de área es requerido");
        }
        // Las áreas son globales, no se asignan a ninguna sede
        Areas areas = new Areas();
        areas.setIdArea(dto.getIdArea());
        areas.setNombreArea(dto.getNombreArea());
        areas.setDescripcion(dto.getDescripcion());

        return ResponseEntity.ok(serviceAreas.modificar(areas));
    }
    @DeleteMapping("/areas/{id}")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public String eliminar(@PathVariable Long id) {
        serviceAreas.eliminar(id);
        return "Área eliminada correctamente";
    }
}