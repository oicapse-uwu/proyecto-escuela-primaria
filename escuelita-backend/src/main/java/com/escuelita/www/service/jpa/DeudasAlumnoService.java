package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.DeudasAlumnoDTO;
import com.escuelita.www.entity.DeudasAlumno;
import com.escuelita.www.entity.ConceptosPago;
import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.repository.DeudasAlumnoRepository;
import com.escuelita.www.service.IDeudasAlumnoService;

@Service
public class DeudasAlumnoService implements IDeudasAlumnoService {
    
    @Autowired
    private DeudasAlumnoRepository repoDeudas;
    
    @Override
    public List<DeudasAlumnoDTO> buscarTodos() {
        return repoDeudas.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public DeudasAlumnoDTO guardar(DeudasAlumnoDTO dto) {
        DeudasAlumno entidad = convertirAEntidad(dto);
        DeudasAlumno guardado = repoDeudas.save(entidad);
        return convertirADTO(guardado);
    }
    
    @Override
    public DeudasAlumnoDTO modificar(DeudasAlumnoDTO dto) {
        DeudasAlumno entidad = convertirAEntidad(dto);
        entidad.setIdDeuda(dto.getIdDeuda()); 
        DeudasAlumno actualizado = repoDeudas.save(entidad);
        return convertirADTO(actualizado);
    }
    
    @Override
    public DeudasAlumnoDTO buscarId(Long id) {
        return repoDeudas.findById(id)
                .map(this::convertirADTO)
                .orElse(null); 
    }
    
    @Override
    public void eliminar(Long id) {
        repoDeudas.deleteById(id);
    }

    // --- MAPPERS ---
    private DeudasAlumno convertirAEntidad(DeudasAlumnoDTO dto) {
        DeudasAlumno entidad = new DeudasAlumno();
        entidad.setDescripcionCuota(dto.getDescripcionCuota());
        entidad.setMontoTotal(dto.getMontoTotal());
        entidad.setFechaEmision(dto.getFechaEmision());
        entidad.setFechaVencimiento(dto.getFechaVencimiento());
        if (dto.getEstadoDeuda() != null) entidad.setEstadoDeuda(dto.getEstadoDeuda());
        entidad.setFechaPagoTotal(dto.getFechaPagoTotal());
        
        if (dto.getIdMatricula() != null) {
            Matriculas mat = new Matriculas();
            // CORRECCIÓN 1: Usamos setId_matricula() en lugar de setIdMatricula()
            mat.setId_matricula(dto.getIdMatricula()); 
            entidad.setMatricula(mat);
        }
        
        if (dto.getIdConcepto() != null) {
            ConceptosPago concepto = new ConceptosPago();
            concepto.setIdConcepto(dto.getIdConcepto()); 
            entidad.setConcepto(concepto);
        }
        return entidad;
    }

    private DeudasAlumnoDTO convertirADTO(DeudasAlumno entidad) {
        DeudasAlumnoDTO dto = new DeudasAlumnoDTO();
        dto.setIdDeuda(entidad.getIdDeuda());
        dto.setDescripcionCuota(entidad.getDescripcionCuota());
        dto.setMontoTotal(entidad.getMontoTotal());
        dto.setFechaEmision(entidad.getFechaEmision());
        dto.setFechaVencimiento(entidad.getFechaVencimiento());
        dto.setEstadoDeuda(entidad.getEstadoDeuda());
        dto.setFechaPagoTotal(entidad.getFechaPagoTotal());
        
        if (entidad.getMatricula() != null) {
            // CORRECCIÓN 2: Usamos getId_matricula() en lugar de getIdMatricula()
            dto.setIdMatricula(entidad.getMatricula().getId_matricula());
        }
        if (entidad.getConcepto() != null) {
            dto.setIdConcepto(entidad.getConcepto().getIdConcepto());
        }
        return dto;
    }
}