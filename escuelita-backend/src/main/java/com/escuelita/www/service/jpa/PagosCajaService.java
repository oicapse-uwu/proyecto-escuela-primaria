package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.PagosCajaDTO;
import com.escuelita.www.entity.PagosCaja;
import com.escuelita.www.entity.MetodosPago;
import com.escuelita.www.entity.Usuarios;
import com.escuelita.www.repository.PagosCajaRepository;
import com.escuelita.www.service.IPagosCajaService;

@Service
public class PagosCajaService implements IPagosCajaService {
    
    @Autowired
    private PagosCajaRepository repoPagosCaja;
    
    @Override
    public List<PagosCajaDTO> buscarTodos() {
        return repoPagosCaja.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public PagosCajaDTO guardar(PagosCajaDTO dto) {
        PagosCaja entidad = convertirAEntidad(dto);
        PagosCaja guardado = repoPagosCaja.save(entidad);
        return convertirADTO(guardado);
    }
    
    @Override
    public PagosCajaDTO modificar(PagosCajaDTO dto) {
        PagosCaja entidad = convertirAEntidad(dto);
        entidad.setIdPago(dto.getIdPago()); 
        PagosCaja actualizado = repoPagosCaja.save(entidad);
        return convertirADTO(actualizado);
    }
    
    @Override
    public PagosCajaDTO buscarId(Long id) {
        return repoPagosCaja.findById(id)
                .map(this::convertirADTO)
                .orElse(null); 
    }
    
    @Override
    public void eliminar(Long id) {
        repoPagosCaja.deleteById(id);
    }

    // --- MAPPERS ---
    private PagosCaja convertirAEntidad(PagosCajaDTO dto) {
        PagosCaja entidad = new PagosCaja();
        entidad.setFechaPago(dto.getFechaPago());
        entidad.setMontoTotalPagado(dto.getMontoTotalPagado());
        entidad.setComprobanteNumero(dto.getComprobanteNumero());
        entidad.setObservacionPago(dto.getObservacionPago());
        if (dto.getEstado() != null) entidad.setEstado(dto.getEstado());
        
        if (dto.getIdMetodo() != null) {
            MetodosPago metodo = new MetodosPago();
            metodo.setIdMetodo(dto.getIdMetodo()); 
            entidad.setMetodo(metodo);
        }
        
        if (dto.getIdUsuario() != null) {
            Usuarios usuario = new Usuarios();
            usuario.setIdUsuario(dto.getIdUsuario()); 
            entidad.setUsuario(usuario);
        }
        return entidad;
    }

    private PagosCajaDTO convertirADTO(PagosCaja entidad) {
        PagosCajaDTO dto = new PagosCajaDTO();
        dto.setIdPago(entidad.getIdPago());
        dto.setFechaPago(entidad.getFechaPago());
        dto.setMontoTotalPagado(entidad.getMontoTotalPagado());
        dto.setComprobanteNumero(entidad.getComprobanteNumero());
        dto.setObservacionPago(entidad.getObservacionPago());
        dto.setEstado(entidad.getEstado());
        
        if (entidad.getMetodo() != null) {
            dto.setIdMetodo(entidad.getMetodo().getIdMetodo());
        }
        if (entidad.getUsuario() != null) {
            dto.setIdUsuario(entidad.getUsuario().getIdUsuario());
        }
        return dto;
    }
}