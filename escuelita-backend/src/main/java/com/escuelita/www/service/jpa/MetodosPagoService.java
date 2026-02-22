package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.MetodosPagoDTO;
import com.escuelita.www.entity.MetodosPago;
import com.escuelita.www.repository.MetodosPagoRepository;
import com.escuelita.www.service.IMetodosPagoService;

@Service
public class MetodosPagoService implements IMetodosPagoService {
    
    @Autowired
    private MetodosPagoRepository repoMetodos;
    
    @Override
    public List<MetodosPagoDTO> buscarTodos() {
        return repoMetodos.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public MetodosPagoDTO guardar(MetodosPagoDTO dto) {
        MetodosPago entidad = convertirAEntidad(dto);
        MetodosPago guardado = repoMetodos.save(entidad);
        return convertirADTO(guardado);
    }
    
    @Override
    public MetodosPagoDTO modificar(MetodosPagoDTO dto) {
        MetodosPago entidad = convertirAEntidad(dto);
        entidad.setIdMetodo(dto.getIdMetodo()); 
        MetodosPago actualizado = repoMetodos.save(entidad);
        return convertirADTO(actualizado);
    }
    
    @Override
    public MetodosPagoDTO buscarId(Long id) {
        return repoMetodos.findById(id)
                .map(this::convertirADTO)
                .orElse(null); 
    }
    
    @Override
    public void eliminar(Long id) {
        repoMetodos.deleteById(id);
    }

    // --- MAPPERS ---
    private MetodosPago convertirAEntidad(MetodosPagoDTO dto) {
        MetodosPago entidad = new MetodosPago();
        entidad.setNombreMetodo(dto.getNombreMetodo());
        if (dto.getRequiereComprobante() != null) entidad.setRequiereComprobante(dto.getRequiereComprobante());
        if (dto.getEstado() != null) entidad.setEstado(dto.getEstado());
        return entidad;
    }

    private MetodosPagoDTO convertirADTO(MetodosPago entidad) {
        MetodosPagoDTO dto = new MetodosPagoDTO();
        dto.setIdMetodo(entidad.getIdMetodo());
        dto.setNombreMetodo(entidad.getNombreMetodo());
        dto.setRequiereComprobante(entidad.getRequiereComprobante());
        dto.setEstado(entidad.getEstado());
        return dto;
    }
}