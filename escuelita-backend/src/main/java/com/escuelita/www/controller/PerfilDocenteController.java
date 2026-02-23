package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.PerfilDocente;
import com.escuelita.www.service.IPerfilDocenteService;

@RestController
@RequestMapping("/restful")
public class PerfilDocenteController {

    @Autowired
    private IPerfilDocenteService servicePerfilDocente;

    @GetMapping("/perfildocente")
    public List<PerfilDocente> buscartodos() {
        return servicePerfilDocente.buscarTodos();
    }

    @PostMapping("/perfildocente")
    public PerfilDocente guardar(@RequestBody PerfilDocente docente) {
        servicePerfilDocente.guardar(docente);
        return docente;
    }

    @PutMapping("/perfildocente")
    public PerfilDocente modificar(@RequestBody PerfilDocente docente) {
        servicePerfilDocente.modificar(docente);
        return docente;
    }

    @GetMapping("/perfildocente/{id}")
    public Optional<PerfilDocente> buscarId(@PathVariable("id") Long id) {
        return servicePerfilDocente.buscarId(id);
    }

    @DeleteMapping("/perfildocente/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePerfilDocente.eliminar(id);
        return "Perfil de docente eliminado correctamente";
    }
}