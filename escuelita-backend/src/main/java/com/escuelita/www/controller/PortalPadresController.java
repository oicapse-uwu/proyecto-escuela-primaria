package com.escuelita.www.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.Calificaciones;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.AlumnosRepository;
import com.escuelita.www.repository.CalificacionesRepository;
import com.escuelita.www.repository.SedesRepository;

@RestController
@RequestMapping("/portal")
public class PortalPadresController {

    @Autowired
    private AlumnosRepository repoAlumnos;

    @Autowired
    private CalificacionesRepository repoCalificaciones;

    @Autowired
    private SedesRepository repoSedes;

    /**
     * Endpoint público: busca notas de un alumno por DNI dentro de una sede.
     * No requiere autenticación (configurado en SecurityConfig).
     *
     * GET /portal/notas/{idSede}/{dni}
     */
    @GetMapping("/notas/{idSede}/{dni}")
    public ResponseEntity<?> consultarNotas(
            @PathVariable Long idSede,
            @PathVariable String dni) {

        // Buscar la sede y su institución
        Optional<Sedes> sedeOpt = repoSedes.findById(idSede);
        if (sedeOpt.isEmpty() || sedeOpt.get().getEstado() == 0) {
            return ResponseEntity.notFound().build();
        }
        Sedes sede = sedeOpt.get();

        // Buscar alumno por DNI dentro de la sede
        Optional<Alumnos> alumnoOpt = repoAlumnos.findByDniAndSede(dni, idSede);
        if (alumnoOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("mensaje", "No se encontró ningún alumno con ese DNI en esta institución."));
        }
        Alumnos alumno = alumnoOpt.get();

        // Obtener calificaciones del alumno
        List<Calificaciones> calificaciones = repoCalificaciones.findByAlumnoId(alumno.getIdAlumno());

        // Construir respuesta sin datos sensibles
        Map<String, Object> institucionInfo = new HashMap<>();
        if (sede.getIdInstitucion() != null) {
            institucionInfo.put("nombre", sede.getIdInstitucion().getNombre());
            institucionInfo.put("logoPath", sede.getIdInstitucion().getLogoPath());
            institucionInfo.put("nombreDirector", sede.getIdInstitucion().getNombreDirector());
            institucionInfo.put("tipoGestion", sede.getIdInstitucion().getTipoGestion());
            institucionInfo.put("codModular", sede.getIdInstitucion().getCodModular());
        }

        Map<String, Object> sedeInfo = new HashMap<>();
        sedeInfo.put("idSede", sede.getIdSede());
        sedeInfo.put("nombreSede", sede.getNombreSede());
        sedeInfo.put("direccion", sede.getDireccion());
        sedeInfo.put("distrito", sede.getDistrito());
        sedeInfo.put("provincia", sede.getProvincia());
        sedeInfo.put("departamento", sede.getDepartamento());
        sedeInfo.put("telefono", sede.getTelefono());
        sedeInfo.put("correoInstitucional", sede.getCorreoInstitucional());
        sedeInfo.put("ugel", sede.getUgel());
        sedeInfo.put("institucion", institucionInfo);

        Map<String, Object> alumnoInfo = new HashMap<>();
        alumnoInfo.put("idAlumno", alumno.getIdAlumno());
        alumnoInfo.put("nombres", alumno.getNombres());
        alumnoInfo.put("apellidos", alumno.getApellidos());
        alumnoInfo.put("numeroDocumento", alumno.getNumeroDocumento());
        alumnoInfo.put("fotoUrl", alumno.getFotoUrl());

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("sede", sedeInfo);
        respuesta.put("alumno", alumnoInfo);
        respuesta.put("calificaciones", calificaciones);

        return ResponseEntity.ok(respuesta);
    }

    /**
     * Endpoint público: obtiene info pública de una sede (para mostrar el header antes de buscar).
     *
     * GET /portal/sede/{idSede}
     */
    @GetMapping("/sede/{idSede}")
    public ResponseEntity<?> infoSede(@PathVariable Long idSede) {
        Optional<Sedes> sedeOpt = repoSedes.findById(idSede);
        if (sedeOpt.isEmpty() || sedeOpt.get().getEstado() == 0) {
            return ResponseEntity.notFound().build();
        }
        Sedes sede = sedeOpt.get();

        Map<String, Object> institucionInfo = new HashMap<>();
        if (sede.getIdInstitucion() != null) {
            institucionInfo.put("nombre", sede.getIdInstitucion().getNombre());
            institucionInfo.put("logoPath", sede.getIdInstitucion().getLogoPath());
            institucionInfo.put("nombreDirector", sede.getIdInstitucion().getNombreDirector());
            institucionInfo.put("tipoGestion", sede.getIdInstitucion().getTipoGestion());
            institucionInfo.put("codModular", sede.getIdInstitucion().getCodModular());
        }

        Map<String, Object> sedeInfo = new HashMap<>();
        sedeInfo.put("idSede", sede.getIdSede());
        sedeInfo.put("nombreSede", sede.getNombreSede());
        sedeInfo.put("direccion", sede.getDireccion());
        sedeInfo.put("distrito", sede.getDistrito());
        sedeInfo.put("provincia", sede.getProvincia());
        sedeInfo.put("departamento", sede.getDepartamento());
        sedeInfo.put("telefono", sede.getTelefono());
        sedeInfo.put("correoInstitucional", sede.getCorreoInstitucional());
        sedeInfo.put("ugel", sede.getUgel());
        sedeInfo.put("institucion", institucionInfo);

        return ResponseEntity.ok(sedeInfo);
    }
}
