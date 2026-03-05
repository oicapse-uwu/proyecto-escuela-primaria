// No modificado
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

import com.escuelita.www.entity.Especialidades;
import com.escuelita.www.entity.PerfilDocente;
import com.escuelita.www.entity.PerfilDocenteDTO;
import com.escuelita.www.entity.Usuarios;
import com.escuelita.www.repository.EspecialidadesRepository;
import com.escuelita.www.repository.UsuariosRepository;
import com.escuelita.www.service.IPerfilDocenteService;

@RestController
@RequestMapping("/restful")
public class PerfilDocenteController {

    @Autowired
    private IPerfilDocenteService servicePerfilDocente;
    @Autowired
    private UsuariosRepository repoUsuarios;
    @Autowired
    private EspecialidadesRepository repoEspecialidades;

    @GetMapping("/perfildocente")
    public List<PerfilDocente> buscarTodos() {
        return servicePerfilDocente.buscarTodos();
    }
    @PostMapping("/perfildocente")
    public ResponseEntity<?> guardar(@RequestBody PerfilDocenteDTO dto) {
        PerfilDocente perfilDocente = new PerfilDocente();
        perfilDocente.setGradoAcademico(dto.getGradoAcademico());
        perfilDocente.setFechaContratacion(dto.getFechaContratacion());
        perfilDocente.setEstadoLaboral(dto.getEstadoLaboral());

        Usuarios usuarios = repoUsuarios
            .findById(dto.getIdUsuario())
            .orElse(null);
        Especialidades especialidades = repoEspecialidades
            .findById(dto.getIdEspecialidad())
            .orElse(null);

        perfilDocente.setIdUsuario(usuarios);
        perfilDocente.setIdEspecialidad(especialidades);

        return ResponseEntity.ok(servicePerfilDocente.guardar(perfilDocente));
    }
    @PutMapping("/perfildocente")
    public ResponseEntity<?> modificar(@RequestBody PerfilDocenteDTO dto) {
        if (dto.getIdDocente() == null) {
            return ResponseEntity.badRequest()
                    .body("ID de docente es requerido");
        }
        PerfilDocente perfilDocente = new PerfilDocente();
        perfilDocente.setIdDocente(dto.getIdDocente());
        perfilDocente.setGradoAcademico(dto.getGradoAcademico());
        perfilDocente.setFechaContratacion(dto.getFechaContratacion());
        perfilDocente.setEstadoLaboral(dto.getEstadoLaboral());

        Usuarios usuarios = repoUsuarios
            .findById(dto.getIdUsuario())
            .orElse(null);
        Especialidades especialidades = repoEspecialidades
            .findById(dto.getIdEspecialidad())
            .orElse(null);

        perfilDocente.setIdUsuario(usuarios);
        perfilDocente.setIdEspecialidad(especialidades);

        return ResponseEntity.ok(servicePerfilDocente.modificar(perfilDocente));
    }
    @GetMapping("/perfildocente/{id}")
    public Optional<PerfilDocente> buscarId(@PathVariable("id") Long id) {
        return servicePerfilDocente.buscarId(id);
    }
    @DeleteMapping("/perfildocente/{id}")
    public String eliminar(@PathVariable Long id){
        servicePerfilDocente.eliminar(id);
        return "Perfil docente eliminado correctamente";
    }
}