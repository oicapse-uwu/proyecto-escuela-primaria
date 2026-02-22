package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Grados;
import com.escuelita.www.entity.Secciones;
import com.escuelita.www.entity.SeccionesDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.GradosRepository;
import com.escuelita.www.repository.SeccionesRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.ISeccionesService;

@Service
public class SeccionesService implements ISeccionesService {
    
    @Autowired 
    private SeccionesRepository repoSecciones;
    
    @Autowired 
    private GradosRepository repoGrados;
    
    // Inyectamos el repo correcto
    @Autowired 
    private SedesRepository repoSedes;
    
    private SeccionesDTO convertirADTO(Secciones seccion) {
        SeccionesDTO dto = new SeccionesDTO();
        dto.setIdSeccion(seccion.getIdSeccion());
        dto.setIdGrado(seccion.getGrado().getIdGrado());
        dto.setIdSede(seccion.getSede().getIdSede()); // Actualizado a Sede
        dto.setNombreSeccion(seccion.getNombreSeccion());
        dto.setVacantes(seccion.getVacantes()); // Agregado vacantes
        dto.setEstado(seccion.getEstado());
        return dto;
    }

    private Secciones convertirAEntidad(SeccionesDTO dto) {
        Secciones seccion = new Secciones();
        seccion.setIdSeccion(dto.getIdSeccion());
        
        Grados grado = repoGrados.findById(dto.getIdGrado()).orElse(null);
        seccion.setGrado(grado);
        
        // Buscamos Sede
        Sedes sede = repoSedes.findById(dto.getIdSede()).orElse(null);
        seccion.setSede(sede);
        
        seccion.setNombreSeccion(dto.getNombreSeccion());
        seccion.setVacantes(dto.getVacantes()); // Agregado vacantes
        seccion.setEstado(dto.getEstado());
        return seccion;
    }

    public List<SeccionesDTO> buscarTodos() {
        return repoSecciones.findAll().stream().map(this::convertirADTO).collect(Collectors.toList());
    }
    
    public SeccionesDTO guardar(SeccionesDTO seccionDTO) {
        Secciones seccionGuardada = repoSecciones.save(convertirAEntidad(seccionDTO));
        return convertirADTO(seccionGuardada);
    }
    
    public SeccionesDTO modificar(SeccionesDTO seccionDTO) {
        Secciones seccionModificada = repoSecciones.save(convertirAEntidad(seccionDTO));
        return convertirADTO(seccionModificada);
    }
    
    public SeccionesDTO buscarId(Long id) {
        return repoSecciones.findById(id).map(this::convertirADTO).orElse(null);
    }
    
    public void eliminar(Long id) {
        repoSecciones.deleteById(id);
    }
}