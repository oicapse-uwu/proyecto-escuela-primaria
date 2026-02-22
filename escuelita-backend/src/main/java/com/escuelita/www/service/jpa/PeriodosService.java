package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.AnioEscolar;
import com.escuelita.www.entity.Periodos;
import com.escuelita.www.entity.PeriodosDTO;
import com.escuelita.www.repository.AnioEscolarRepository;
import com.escuelita.www.repository.PeriodosRepository;
import com.escuelita.www.service.IPeriodosService;

@Service
public class PeriodosService implements IPeriodosService {
    
    @Autowired 
    private PeriodosRepository repoPeriodos;
    
    @Autowired 
    private AnioEscolarRepository repoAnioEscolar;
    
    private PeriodosDTO convertirADTO(Periodos periodo) {
        PeriodosDTO dto = new PeriodosDTO();
        dto.setIdPeriodo(periodo.getIdPeriodo());
        // Se actualiza a idAnio
        dto.setIdAnio(periodo.getAnioEscolar().getIdAnioEscolar());
        dto.setNombrePeriodo(periodo.getNombrePeriodo());
        dto.setFechaInicio(periodo.getFechaInicio());
        dto.setFechaFin(periodo.getFechaFin());
        dto.setEstado(periodo.getEstado());
        return dto;
    }

    private Periodos convertirAEntidad(PeriodosDTO dto) {
        Periodos periodo = new Periodos();
        periodo.setIdPeriodo(dto.getIdPeriodo());
        
        // Se busca usando getIdAnio()
        AnioEscolar anio = repoAnioEscolar.findById(dto.getIdAnio()).orElse(null);
        periodo.setAnioEscolar(anio);
        
        periodo.setNombrePeriodo(dto.getNombrePeriodo());
        periodo.setFechaInicio(dto.getFechaInicio());
        periodo.setFechaFin(dto.getFechaFin());
        periodo.setEstado(dto.getEstado());
        return periodo;
    }

    public List<PeriodosDTO> buscarTodos() {
        return repoPeriodos.findAll().stream().map(this::convertirADTO).collect(Collectors.toList());
    }
    
    public PeriodosDTO guardar(PeriodosDTO periodoDTO) {
        Periodos periodoGuardado = repoPeriodos.save(convertirAEntidad(periodoDTO));
        return convertirADTO(periodoGuardado);
    }
    
    public PeriodosDTO modificar(PeriodosDTO periodoDTO) {
        Periodos periodoModificado = repoPeriodos.save(convertirAEntidad(periodoDTO));
        return convertirADTO(periodoModificado);
    }
    
    public PeriodosDTO buscarId(Long id) {
        return repoPeriodos.findById(id).map(this::convertirADTO).orElse(null);
    }
    
    public void eliminar(Long id) {
        repoPeriodos.deleteById(id);
    }
}