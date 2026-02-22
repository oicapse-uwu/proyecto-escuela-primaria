package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.PagoDetalleDTO;
import com.escuelita.www.entity.PagoDetalle;
import com.escuelita.www.entity.PagosCaja;
import com.escuelita.www.entity.DeudasAlumno;
import com.escuelita.www.repository.PagoDetalleRepository;
import com.escuelita.www.service.IPagoDetalleService;

@Service
public class PagoDetalleService implements IPagoDetalleService {
    
    @Autowired
    private PagoDetalleRepository repoPagoDetalle;
    
    @Override
    public List<PagoDetalleDTO> buscarTodos() {
        return repoPagoDetalle.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public PagoDetalleDTO guardar(PagoDetalleDTO dto) {
        PagoDetalle entidad = convertirAEntidad(dto);
        PagoDetalle guardado = repoPagoDetalle.save(entidad);
        return convertirADTO(guardado);
    }
    
    @Override
    public PagoDetalleDTO modificar(PagoDetalleDTO dto) {
        PagoDetalle entidad = convertirAEntidad(dto);
        entidad.setIdPagoDetalle(dto.getIdPagoDetalle()); 
        PagoDetalle actualizado = repoPagoDetalle.save(entidad);
        return convertirADTO(actualizado);
    }
    
    @Override
    public PagoDetalleDTO buscarId(Long id) {
        return repoPagoDetalle.findById(id)
                .map(this::convertirADTO)
                .orElse(null); 
    }
    
    @Override
    public void eliminar(Long id) {
        repoPagoDetalle.deleteById(id);
    }

    // --- MAPPERS ---
    private PagoDetalle convertirAEntidad(PagoDetalleDTO dto) {
        PagoDetalle entidad = new PagoDetalle();
        entidad.setMontoAplicado(dto.getMontoAplicado());
        if (dto.getEstado() != null) entidad.setEstado(dto.getEstado());
        
        if (dto.getIdPago() != null) {
            PagosCaja pago = new PagosCaja();
            pago.setIdPago(dto.getIdPago()); 
            entidad.setPago(pago);
        }
        
        if (dto.getIdDeuda() != null) {
            DeudasAlumno deuda = new DeudasAlumno();
            deuda.setIdDeuda(dto.getIdDeuda()); 
            entidad.setDeuda(deuda);
        }
        
        return entidad;
    }

    private PagoDetalleDTO convertirADTO(PagoDetalle entidad) {
        PagoDetalleDTO dto = new PagoDetalleDTO();
        dto.setIdPagoDetalle(entidad.getIdPagoDetalle());
        dto.setMontoAplicado(entidad.getMontoAplicado());
        dto.setEstado(entidad.getEstado());
        
        if (entidad.getPago() != null) {
            dto.setIdPago(entidad.getPago().getIdPago());
        }
        if (entidad.getDeuda() != null) {
            dto.setIdDeuda(entidad.getDeuda().getIdDeuda());
        }
        
        return dto;
    }
}