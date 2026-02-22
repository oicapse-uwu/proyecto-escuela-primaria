package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Aulas;
import com.escuelita.www.entity.AulasDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.AulasRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.IAulasService;

@Service
public class AulasService implements IAulasService {
    
    @Autowired 
    private AulasRepository repoAulas;
    
    @Autowired 
    private SedesRepository repoSedes;
    
    private AulasDTO convertirADTO(Aulas aula) {
        AulasDTO dto = new AulasDTO();
        dto.setIdAula(aula.getIdAula());
        dto.setIdSede(aula.getSede().getIdSede());
        dto.setNombreAula(aula.getNombreAula());
        dto.setCapacidad(aula.getCapacidad());
        dto.setEstado(aula.getEstado());
        return dto;
    }

    private Aulas convertirAEntidad(AulasDTO dto) {
        Aulas aula = new Aulas();
        aula.setIdAula(dto.getIdAula());
        
        Sedes sede = repoSedes.findById(dto.getIdSede()).orElse(null);
        aula.setSede(sede);
        
        aula.setNombreAula(dto.getNombreAula());
        aula.setCapacidad(dto.getCapacidad());
        aula.setEstado(dto.getEstado());
        return aula;
    }

    public List<AulasDTO> buscarTodos() {
        return repoAulas.findAll().stream().map(this::convertirADTO).collect(Collectors.toList());
    }
    
    public AulasDTO guardar(AulasDTO aulaDTO) {
        Aulas aulaGuardada = repoAulas.save(convertirAEntidad(aulaDTO));
        return convertirADTO(aulaGuardada);
    }
    
    public AulasDTO modificar(AulasDTO aulaDTO) {
        Aulas aulaModificada = repoAulas.save(convertirAEntidad(aulaDTO));
        return convertirADTO(aulaModificada);
    }
    
    public AulasDTO buscarId(Long id) {
        return repoAulas.findById(id).map(this::convertirADTO).orElse(null);
    }
    
    public void eliminar(Long id) {
        repoAulas.deleteById(id);
    }
}