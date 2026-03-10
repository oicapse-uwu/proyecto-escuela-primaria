package com.escuelita.www.service.jpa;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelita.www.entity.Calificaciones;
import com.escuelita.www.entity.Evaluaciones;
import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.ReporteAcademicoDTO;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.repository.CalificacionesRepository;
import com.escuelita.www.repository.EvaluacionesRepository;
import com.escuelita.www.repository.InstitucionRepository;
import com.escuelita.www.repository.PerfilDocenteRepository;
import com.escuelita.www.repository.SuscripcionesRepository;

@Service
public class ReporteAcademicoService {

    @Autowired
    private InstitucionRepository repoInstitucion;
    @Autowired
    private EvaluacionesRepository repoEvaluaciones;
    @Autowired
    private CalificacionesRepository repoCalificaciones;
    @Autowired
    private PerfilDocenteRepository repoPerfilDocente;
    @Autowired
    private SuscripcionesRepository repoSuscripciones;

    @Transactional(readOnly = true)
    public List<ReporteAcademicoDTO> generarReporte() {
        List<Institucion> instituciones = repoInstitucion.findAll();
        List<Evaluaciones> todasEvaluaciones = repoEvaluaciones.findAll();
        List<Calificaciones> todasCalificaciones = repoCalificaciones.findAll();

        // Agrupar evaluaciones por institucion
        Map<Long, List<Evaluaciones>> evalsPorInst = new HashMap<>();
        Map<Long, Set<Long>> docentesPorInst = new HashMap<>();
        for (Evaluaciones eval : todasEvaluaciones) {
            try {
                Long instId = eval.getIdAsignacion().getIdSeccion().getIdSede().getIdInstitucion().getIdInstitucion();
                evalsPorInst.computeIfAbsent(instId, k -> new ArrayList<>()).add(eval);
                Long docenteId = eval.getIdAsignacion().getIdDocente().getIdDocente();
                docentesPorInst.computeIfAbsent(instId, k -> new HashSet<>()).add(docenteId);
            } catch (NullPointerException ignored) {}
        }

        // Agrupar calificaciones por institucion
        Map<Long, List<Calificaciones>> califsPorInst = new HashMap<>();
        Map<Long, Set<Long>> alumnosPorInst = new HashMap<>();
        for (Calificaciones calif : todasCalificaciones) {
            try {
                Long instId = calif.getIdMatricula().getIdSeccion().getIdSede().getIdInstitucion().getIdInstitucion();
                califsPorInst.computeIfAbsent(instId, k -> new ArrayList<>()).add(calif);
                Long alumnoId = calif.getIdMatricula().getIdAlumno().getIdAlumno();
                alumnosPorInst.computeIfAbsent(instId, k -> new HashSet<>()).add(alumnoId);
            } catch (NullPointerException ignored) {}
        }

        List<ReporteAcademicoDTO> resultado = new ArrayList<>();

        for (Institucion inst : instituciones) {
            Long instId = inst.getIdInstitucion();
            ReporteAcademicoDTO dto = new ReporteAcademicoDTO();
            dto.setIdInstitucion(instId);
            dto.setNombreInstitucion(inst.getNombre());
            dto.setCodModular(inst.getCodModular());

            List<Evaluaciones> evals = evalsPorInst.getOrDefault(instId, List.of());
            List<Calificaciones> califs = califsPorInst.getOrDefault(instId, List.of());
            Set<Long> docentes = docentesPorInst.getOrDefault(instId, Set.of());
            Set<Long> alumnos = alumnosPorInst.getOrDefault(instId, Set.of());

            dto.setTotalEvaluaciones(evals.size());
            dto.setTotalCalificaciones(califs.size());
            dto.setTotalAlumnosEvaluados(alumnos.size());
            dto.setTotalDocentes(docentes.size());

            // Calcular promedio de notas
            double sumaNotas = 0;
            int conteoNotas = 0;
            for (Calificaciones calif : califs) {
                try {
                    double nota = Double.parseDouble(calif.getNotaObtenida());
                    sumaNotas += nota;
                    conteoNotas++;
                } catch (NumberFormatException | NullPointerException ignored) {}
            }
            dto.setPromedioNotasGeneral(conteoNotas > 0 ? Math.round((sumaNotas / conteoNotas) * 100.0) / 100.0 : 0);

            // Estado suscripcion
            List<Suscripciones> suscripciones = repoSuscripciones.findByIdInstitucion(inst);
            String estadoSusc = "Sin suscripción";
            for (Suscripciones susc : suscripciones) {
                if (susc.getIdEstado() != null && susc.getIdEstado().getNombre() != null
                        && susc.getIdEstado().getNombre().toUpperCase().contains("ACT")) {
                    estadoSusc = susc.getIdEstado().getNombre();
                    break;
                }
            }
            dto.setEstadoSuscripcion(estadoSusc);

            resultado.add(dto);
        }

        return resultado;
    }
}
