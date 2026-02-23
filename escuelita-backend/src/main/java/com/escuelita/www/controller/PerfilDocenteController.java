package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.PerfilDocente;
import com.escuelita.www.entity.PerfilDocenteDTO;
import com.escuelita.www.entity.Usuarios;
import com.escuelita.www.entity.Especialidades;
import com.escuelita.www.repository.UsuariosRepository;
import com.escuelita.www.repository.EspecialidadesRepository;
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
        docente.setGrado_academico(dto.getGrado_academico());
        docente.setFecha_contratacion(dto.getFecha_contratacion());
        docente.setEstado_laboral(dto.getEstado_laboral());
        if (dto.getEstado() != null)
            docente.setEstado(dto.getEstado());

        // Buscando relaciones
        Usuarios usuario = repoUsuarios.findById(dto.getId_usuario()).orElse(null);
        Especialidades especialidad = repoEspecialidades.findById(dto.getId_especialidad()).orElse(null);

        docente.setUsuario(usuario);
        docente.setEspecialidad(especialidad);

        servicePerfilDocente.guardar(docente);
        return ResponseEntity.ok(docente);
    }

    @PutMapping("/perfildocente")
    public ResponseEntity<?> modificar(@RequestBody PerfilDocenteDTO dto) {
        if (dto.getId_docente() == null) {
            return ResponseEntity.badRequest().body("ID de docente es requerido");
        }
        PerfilDocente docente = new PerfilDocente();
        docente.setId_docente(dto.getId_docente());
        docente.setGrado_academico(dto.getGrado_academico());
        docente.setFecha_contratacion(dto.getFecha_contratacion());
        docente.setEstado_laboral(dto.getEstado_laboral());
        if (dto.getEstado() != null)
            docente.setEstado(dto.getEstado());

        // Para que esto funcione, asegúrate de tener el constructor public
        // Usuarios(Long id) en tu entidad
        docente.setUsuario(new Usuarios(dto.getId_usuario()));
        docente.setEspecialidad(new Especialidades(dto.getId_especialidad()));

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