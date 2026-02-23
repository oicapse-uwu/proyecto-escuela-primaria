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
@RequestMapping("/primaria_bd_real")
public class PerfilDocenteController {

    @Autowired
    private IPerfilDocenteService servicePerfilDocente;
    @Autowired
    private UsuariosRepository repoUsuarios;
    @Autowired
    private EspecialidadesRepository repoEspecialidades;

    @GetMapping("/perfildocente")
    public List<PerfilDocente> buscartodos() {
        return servicePerfilDocente.buscarTodos();
    }

    @PostMapping("/perfildocente")
    public ResponseEntity<?> guardar(@RequestBody PerfilDocenteDTO dto) {
        PerfilDocente docente = new PerfilDocente();
        docente.setGradoAcademico(dto.getGradoAcademico());
        docente.setFechaContratacion(dto.getFechaContratacion());
        docente.setEstadoLaboral(dto.getEstadoLaboral());
        if (dto.getEstado() != null)
            docente.setEstado(dto.getEstado());

        // Buscando relaciones
        Usuarios usuario = repoUsuarios.findById(dto.getIdUsuario()).orElse(null);
        Especialidades especialidad = repoEspecialidades.findById(dto.getIdEspecialidad()).orElse(null);

        docente.setUsuario(usuario);
        docente.setEspecialidad(especialidad);

        servicePerfilDocente.guardar(docente);
        return ResponseEntity.ok(docente);
    }

    @PutMapping("/perfildocente")
    public ResponseEntity<?> modificar(@RequestBody PerfilDocenteDTO dto) {
        if (dto.getIdDocente() == null) {
            return ResponseEntity.badRequest().body("ID de docente es requerido");
        }
        PerfilDocente docente = new PerfilDocente();
        docente.setIdDocente(dto.getIdDocente());
        docente.setGradoAcademico(dto.getGradoAcademico());
        docente.setFechaContratacion(dto.getFechaContratacion());
        docente.setEstadoLaboral(dto.getEstadoLaboral());
        if (dto.getEstado() != null)
            docente.setEstado(dto.getEstado());

        // Para que esto funcione, asegúrate de tener el constructor public
        // Usuarios(Long id) en tu entidad
        docente.setUsuario(repoUsuarios.findById(dto.getIdUsuario()).orElse(null));
        docente.setEspecialidad(repoEspecialidades.findById(dto.getIdEspecialidad()).orElse(null));

        servicePerfilDocente.modificar(docente);
        return ResponseEntity.ok(docente);
    }

    @GetMapping("/perfildocente/{id}")
    public Optional<PerfilDocente> buscarId(@PathVariable("id") Long id) {
        return servicePerfilDocente.buscarId(id);
    }

    @DeleteMapping("/perfildocente/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePerfilDocente.eliminar(id);
        return "Perfil docente eliminado";
    }
}