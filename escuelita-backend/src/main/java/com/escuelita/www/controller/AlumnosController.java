/*
    MODIFICADO - Validacion de la existencia de la sede, 
    que la suscripcion este vigente y la capacidad de alumnos
*/
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

import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.AlumnosDTO;
import com.escuelita.www.entity.LimitesSedesSuscripcion;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.entity.TipoDocumentos;
import com.escuelita.www.repository.AlumnosRepository;
import com.escuelita.www.repository.LimitesSedesSuscripcionRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.repository.SuscripcionesRepository;
import com.escuelita.www.repository.TipoDocumentosRepository;
import com.escuelita.www.service.IAlumnosService;
import com.escuelita.www.security.RequireModulo;

@RestController
@RequestMapping("/restful")
public class AlumnosController {

    @Autowired
    private IAlumnosService serviceAlumnos;
    @Autowired
    private TipoDocumentosRepository repoTipoDocumentos;
    @Autowired
    private SedesRepository repoSedes;
    @Autowired
    private AlumnosRepository repoAlumnos;
    @Autowired
    private LimitesSedesSuscripcionRepository repoLimitesSedes;
    @Autowired
    private SuscripcionesRepository repoSuscripciones;

    @GetMapping("/alumnos")
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public List<Alumnos> buscarTodos() {
        return serviceAlumnos.buscarTodos(); 
    }
    @PostMapping("/alumnos")
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public ResponseEntity<?> guardar(@RequestBody AlumnosDTO dto) {
        System.out.println("🔍 Intentando crear alumno para sede ID: " + dto.getIdSede());
        System.out.println("🟡 Estado del alumno recibido: '" + dto.getEstadoAlumno() + "'");

        // 🔒 VALIDACIÓN DE LÍMITES POR SEDE
        // Solo validar si el alumno será ACTIVO (case-insensitive)
        if (dto.getEstadoAlumno() != null && dto.getEstadoAlumno().toUpperCase().equals("ACTIVO")) {
            System.out.println("✅ Alumno ACTIVO detectado, ejecutando validación de límites...");
            Sedes sede = repoSedes.findById(dto.getIdSede()).orElse(null);
            if (sede == null) {
                System.err.println("❌ Sede no encontrada: " + dto.getIdSede());
                return ResponseEntity.badRequest().body("Sede no encontrada");
            }

            System.out.println("📍 Sede encontrada: " + sede.getNombreSede() + " (Institución: " + sede.getIdInstitucion().getNombre() + ")");

            // Buscar suscripción activa de la institución
            Optional<Suscripciones> suscripcionOpt = repoSuscripciones
                .findSuscripcionActivaByInstitucion(sede.getIdInstitucion());

            if (suscripcionOpt.isPresent()) {
                Suscripciones suscripcionActiva = suscripcionOpt.get();
                System.out.println("📋 Suscripción activa encontrada: ID=" + suscripcionActiva.getIdSuscripcion() 
                                    + ", Límite total=" + suscripcionActiva.getLimiteAlumnosContratado());

                // Buscar límite asignado a esta sede
                Optional<LimitesSedesSuscripcion> limite = repoLimitesSedes
                    .findByIdSuscripcionIdAndIdSedeId(
                        suscripcionActiva.getIdSuscripcion(),
                        dto.getIdSede()
                    );

                if (limite.isPresent()) {
                    int limiteAsignado = limite.get().getLimiteAlumnosAsignado();
                    long alumnosActuales = repoAlumnos.countAlumnosActivosBySede(dto.getIdSede());

                    System.out.println("🎯 Límite asignado a sede: " + limiteAsignado);
                    System.out.println("👥 Alumnos activos actuales: " + alumnosActuales);

                    if (alumnosActuales >= limiteAsignado) {
                        String mensajeError = String.format(
                            "No se puede crear el alumno. La sede '%s' ha alcanzado su límite de %d alumnos activos (%d actuales).",
                            sede.getNombreSede(),
                            limiteAsignado,
                            alumnosActuales
                        );
                        System.err.println("❌ " + mensajeError);
                        return ResponseEntity.badRequest().body(mensajeError);
                    }

                    System.out.println("✅ Validación OK: " + alumnosActuales + " < " + limiteAsignado);
                } else {
                    System.out.println("⚠️ No hay límite configurado para esta sede. Permitiendo creación.");
                }
            } else {
                System.out.println("⚠️ No hay suscripción activa. Permitiendo creación.");
            }
        } else {
            System.out.println("ℹ️ Alumno no activo, saltando validación de límites");
        }

        // Proceder con la creación del alumno
        Alumnos alumnos = new Alumnos();
        alumnos.setNombres(dto.getNombres());
        alumnos.setApellidos(dto.getApellidos());
        alumnos.setNumeroDocumento(dto.getNumeroDocumento());
        alumnos.setFechaNacimiento(dto.getFechaNacimiento());
        alumnos.setGenero(dto.getGenero());
        alumnos.setDireccion(dto.getDireccion());
        alumnos.setTelefonoContacto(dto.getTelefonoContacto());
        alumnos.setFotoUrl(dto.getFotoUrl());
        alumnos.setObservacionesSalud(dto.getObservacionesSalud());
        alumnos.setTipoIngreso(dto.getTipoIngreso());
        alumnos.setEstadoAlumno(dto.getEstadoAlumno());

        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        TipoDocumentos tipoDocumentos = repoTipoDocumentos
            .findById(dto.getIdTipoDoc())
            .orElse(null);

        alumnos.setIdSede(sedes);
        alumnos.setIdTipoDoc(tipoDocumentos);

        return ResponseEntity.ok(serviceAlumnos.guardar(alumnos));
    }
    @PutMapping("/alumnos")
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public ResponseEntity<?> modificar(@RequestBody AlumnosDTO dto) {
        if(dto.getIdAlumno() == null){
            return ResponseEntity.badRequest()
                    .body("ID de alumno es requerido");
        }
        Alumnos alumnos = new Alumnos();
        alumnos.setIdAlumno(dto.getIdAlumno());
        alumnos.setNombres(dto.getNombres());
        alumnos.setApellidos(dto.getApellidos());
        alumnos.setNumeroDocumento(dto.getNumeroDocumento());
        alumnos.setFechaNacimiento(dto.getFechaNacimiento());
        alumnos.setGenero(dto.getGenero());
        alumnos.setDireccion(dto.getDireccion());
        alumnos.setTelefonoContacto(dto.getTelefonoContacto());
        alumnos.setFotoUrl(dto.getFotoUrl());
        alumnos.setObservacionesSalud(dto.getObservacionesSalud());
        alumnos.setTipoIngreso(dto.getTipoIngreso());
        alumnos.setEstadoAlumno(dto.getEstadoAlumno());

        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        TipoDocumentos tipoDocumentos = repoTipoDocumentos
            .findById(dto.getIdTipoDoc())
            .orElse(null);

        alumnos.setIdSede(sedes);
        alumnos.setIdTipoDoc(tipoDocumentos);

        return ResponseEntity.ok(serviceAlumnos.modificar(alumnos));
    }
    @GetMapping("/alumnos/{id}")
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public Optional<Alumnos> buscarId(@PathVariable("id") Long id){
        return serviceAlumnos.buscarId(id);
    }
    @DeleteMapping("/alumnos/{id}")
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public String eliminar(@PathVariable Long id){
        serviceAlumnos.eliminar(id);
        return "Alumno eliminado correctamente";
    }   
}