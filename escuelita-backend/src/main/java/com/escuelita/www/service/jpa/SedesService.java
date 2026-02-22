package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.SedesDTO;
import com.escuelita.www.entity.Institucion;
import com.escuelita.www.repository.InstitucionRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.ISedesService;

@Service
public class SedesService implements ISedesService {
    
    @Autowired private SedesRepository repoSedes;
    @Autowired private InstitucionRepository repoInstitucion;
    
    private SedesDTO convertirADTO(Sedes sede) {
        SedesDTO dto = new SedesDTO();
        dto.setIdSede(sede.getIdSede());
        dto.setIdInstitucion(sede.getInstitucion().getIdInstitucion());
        dto.setNombreSede(sede.getNombreSede());
        dto.setDireccion(sede.getDireccion());
        dto.setDistrito(sede.getDistrito());
        dto.setProvincia(sede.getProvincia());
        dto.setDepartamento(sede.getDepartamento());
        dto.setUgel(sede.getUgel());
        dto.setTelefono(sede.getTelefono());
        dto.setCorreoInstitucional(sede.getCorreoInstitucional());
        dto.setEstado(sede.getEstado());
        return dto;
    }

    private Sedes convertirAEntidad(SedesDTO dto) {
        Sedes sede = new Sedes();
        sede.setIdSede(dto.getIdSede());
        Institucion institucion = repoInstitucion.findById(dto.getIdInstitucion()).orElse(null);
        sede.setInstitucion(institucion);
        sede.setNombreSede(dto.getNombreSede());
        sede.setDireccion(dto.getDireccion());
        sede.setDistrito(dto.getDistrito());
        sede.setProvincia(dto.getProvincia());
        sede.setDepartamento(dto.getDepartamento());
        sede.setUgel(dto.getUgel());
        sede.setTelefono(dto.getTelefono());
        sede.setCorreoInstitucional(dto.getCorreoInstitucional());
        sede.setEstado(dto.getEstado());
        return sede;
    }

    public List<SedesDTO> buscarTodos(){
        return repoSedes.findAll().stream().map(this::convertirADTO).collect(Collectors.toList());
    }
    public SedesDTO guardar(SedesDTO sedeDTO){
        Sedes sedeGuardada = repoSedes.save(convertirAEntidad(sedeDTO));
        return convertirADTO(sedeGuardada);
    }
    public SedesDTO modificar(SedesDTO sedeDTO){
        Sedes sedeModificada = repoSedes.save(convertirAEntidad(sedeDTO));
        return convertirADTO(sedeModificada);
    }
    public SedesDTO buscarId(Long id){
        return repoSedes.findById(id).map(this::convertirADTO).orElse(null);
    }
    public void eliminar(Long id){
        repoSedes.deleteById(id);
    }
}