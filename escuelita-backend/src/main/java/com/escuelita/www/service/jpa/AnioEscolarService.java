package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.AnioEscolar;
import com.escuelita.www.entity.AnioEscolarDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.AnioEscolarRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.IAnioEscolarService;

@Service
public class AnioEscolarService implements IAnioEscolarService {
    
    @Autowired private AnioEscolarRepository repoAnioEscolar;
    @Autowired private SedesRepository repoSedes;
    
    private AnioEscolarDTO convertirADTO(AnioEscolar anio) {
        AnioEscolarDTO dto = new AnioEscolarDTO();
        dto.setIdAnioEscolar(anio.getIdAnioEscolar());
        dto.setIdSede(anio.getSede().getIdSede());
        dto.setNombreAnio(anio.getNombreAnio());
        dto.setActivo(anio.getActivo());
        dto.setEstado(anio.getEstado());
        return dto;
    }

    private AnioEscolar convertirAEntidad(AnioEscolarDTO dto) {
        AnioEscolar anio = new AnioEscolar();
        anio.setIdAnioEscolar(dto.getIdAnioEscolar());
        Sedes sede = repoSedes.findById(dto.getIdSede()).orElse(null);
        anio.setSede(sede);
        anio.setNombreAnio(dto.getNombreAnio());
        anio.setActivo(dto.getActivo());
        anio.setEstado(dto.getEstado());
        return anio;
    }

    public List<AnioEscolarDTO> buscarTodos(){
        return repoAnioEscolar.findAll().stream().map(this::convertirADTO).collect(Collectors.toList());
    }
    public AnioEscolarDTO guardar(AnioEscolarDTO anioEscolarDTO){
        AnioEscolar anioGuardado = repoAnioEscolar.save(convertirAEntidad(anioEscolarDTO));
        return convertirADTO(anioGuardado);
    }
    public AnioEscolarDTO modificar(AnioEscolarDTO anioEscolarDTO){
        AnioEscolar anioModificado = repoAnioEscolar.save(convertirAEntidad(anioEscolarDTO));
        return convertirADTO(anioModificado);
    }
    public AnioEscolarDTO buscarId(Long id){
        return repoAnioEscolar.findById(id).map(this::convertirADTO).orElse(null);
    }
    public void eliminar(Long id){
        repoAnioEscolar.deleteById(id);
    }
}
