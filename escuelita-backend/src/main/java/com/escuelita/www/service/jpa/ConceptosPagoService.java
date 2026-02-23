package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.ConceptosPagoDTO;
import com.escuelita.www.entity.ConceptosPago;
import com.escuelita.www.entity.Grados;
import com.escuelita.www.entity.Institucion;
import com.escuelita.www.repository.ConceptosPagoRepository;
import com.escuelita.www.service.IConceptosPagoService;

@Service
public class ConceptosPagoService implements IConceptosPagoService {
    
    @Autowired
    private ConceptosPagoRepository repoConceptos;
    
    @Override
    public List<ConceptosPagoDTO> buscarTodos() {
        return repoConceptos.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public ConceptosPagoDTO guardar(ConceptosPagoDTO dto) {
        ConceptosPago entidad = convertirAEntidad(dto);
        ConceptosPago guardado = repoConceptos.save(entidad);
        return convertirADTO(guardado);
    }
    
    @Override
    public ConceptosPagoDTO modificar(ConceptosPagoDTO dto) {
        ConceptosPago entidad = convertirAEntidad(dto);
        entidad.setIdConcepto(dto.getIdConcepto()); 
        ConceptosPago actualizado = repoConceptos.save(entidad);
        return convertirADTO(actualizado);
    }
    
    @Override
    public ConceptosPagoDTO buscarId(Long id) {
        return repoConceptos.findById(id)
                .map(this::convertirADTO)
                .orElse(null); 
    }
    
    @Override
    public void eliminar(Long id) {
        repoConceptos.deleteById(id);
    }

    // --- MAPPERS ---

    private ConceptosPago convertirAEntidad(ConceptosPagoDTO dto) {
        ConceptosPago entidad = new ConceptosPago();
        entidad.setNombreConcepto(dto.getNombreConcepto());
        entidad.setMonto(dto.getMonto());
        if (dto.getEstadoConcepto() != null) entidad.setEstadoConcepto(dto.getEstadoConcepto());
        
        if (dto.getIdInstitucion() != null) {
            Institucion inst = new Institucion();
            inst.setIdInstitucion(dto.getIdInstitucion()); 
            entidad.setInstitucion(inst);
        }
        
        if (dto.getIdGrado() != null) {
            Grados grado = new Grados();
            grado.setIdGrado(dto.getIdGrado()); 
            entidad.setGrado(grado);
        }
        
        return entidad;
    }

    private ConceptosPagoDTO convertirADTO(ConceptosPago entidad) {
        ConceptosPagoDTO dto = new ConceptosPagoDTO();
        dto.setIdConcepto(entidad.getIdConcepto());
        dto.setNombreConcepto(entidad.getNombreConcepto());
        dto.setMonto(entidad.getMonto());
        dto.setEstadoConcepto(entidad.getEstadoConcepto());
        
        if (entidad.getInstitucion() != null) {
            dto.setIdInstitucion(entidad.getInstitucion().getIdInstitucion());
        }
        if (entidad.getGrado() != null) {
            dto.setIdGrado(entidad.getGrado().getIdGrado());
        }
        
        return dto;
    }
}