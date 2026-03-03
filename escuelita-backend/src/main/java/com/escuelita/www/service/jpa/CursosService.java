package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Cursos;
import com.escuelita.www.repository.CursosRepository;
import com.escuelita.www.service.ICursosService;
import com.escuelita.www.util.TenantContext;

@Service
public class CursosService implements ICursosService {
    @Autowired
    private CursosRepository repoCursos;

    public List<Cursos> buscarTodos() {
        if (TenantContext.isSuperAdmin()) {
            return repoCursos.findAll();
        }
        return repoCursos.findBySedeId(TenantContext.getSedeId());
    }
    
    @Override
    public Cursos guardar(Cursos cursos) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = cursos.getIdArea() != null && 
                         cursos.getIdArea().getIdSede() != null
                         ? cursos.getIdArea().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para crear cursos en esta sede");
            }
        }
        return repoCursos.save(cursos);
    }
    
    @Override
    public Cursos modificar(Cursos cursos) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = cursos.getIdArea() != null && 
                         cursos.getIdArea().getIdSede() != null
                         ? cursos.getIdArea().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para modificar cursos de esta sede");
            }
        }
        return repoCursos.save(cursos);
    }
    
    public Optional<Cursos> buscarId(Long id) {
        Optional<Cursos> curso = repoCursos.findById(id);
        
        if (TenantContext.isSuperAdmin()) {
            return curso;
        }
        
        if (curso.isPresent()) {
            Long sedeId = curso.get().getIdArea() != null && 
                         curso.get().getIdArea().getIdSede() != null
                         ? curso.get().getIdArea().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId != null && sedeId.equals(TenantContext.getSedeId())) {
                return curso;
            }
        }
        return Optional.empty();
    }
    
    public void eliminar(Long id) {
        Optional<Cursos> curso = repoCursos.findById(id);
        if (curso.isPresent() && !TenantContext.isSuperAdmin()) {
            Long sedeId = curso.get().getIdArea() != null && 
                         curso.get().getIdArea().getIdSede() != null
                         ? curso.get().getIdArea().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para eliminar cursos de esta sede");
            }
        }
        repoCursos.deleteById(id);
    }
}