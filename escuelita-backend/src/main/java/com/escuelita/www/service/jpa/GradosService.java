package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Grados;
import com.escuelita.www.entity.GradosDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.GradosRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.IGradosService;

@Service
public class GradosService implements IGradosService {
    
    @Autowired 
    private GradosRepository repoGrados;
    
    @Autowired 
    private SedesRepository repoSedes;
    
    private GradosDTO convertirADTO(Grados grado) {
        GradosDTO dto = new GradosDTO();
        dto.setIdGrado(grado.getIdGrado());
        dto.setIdSede(grado.getSede().getIdSede());
        dto.setNombreGrado(grado.getNombreGrado());
        dto.setEstado(grado.getEstado());
        return dto;
    }

    private Grados convertirAEntidad(GradosDTO dto) {
        Grados grado = new Grados();
        grado.setIdGrado(dto.getIdGrado());
        
        Sedes sede = repoSedes.findById(dto.getIdSede()).orElse(null);
        grado.setSede(sede);
        
        grado.setNombreGrado(dto.getNombreGrado());
        grado.setEstado(dto.getEstado());
        return grado;
    }

    public List<GradosDTO> buscarTodos() {
        return repoGrados.findAll().stream().map(this::convertirADTO).collect(Collectors.toList());
    }
    
    public GradosDTO guardar(GradosDTO gradoDTO) {
        Grados gradoGuardado = repoGrados.save(convertirAEntidad(gradoDTO));
        return convertirADTO(gradoGuardado);
    }
    
    public GradosDTO modificar(GradosDTO gradoDTO) {
        Grados gradoModificado = repoGrados.save(convertirAEntidad(gradoDTO));
        return convertirADTO(gradoModificado);
    }
    
    public GradosDTO buscarId(Long id) {
        return repoGrados.findById(id).map(this::convertirADTO).orElse(null);
    }
    
    public void eliminar(Long id) {
        repoGrados.deleteById(id);
    }
}