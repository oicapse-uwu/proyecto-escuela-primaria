package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.repository.MatriculasRepository;
import com.escuelita.www.service.IMatriculasService;
import com.escuelita.www.util.TenantContext;

@Service
public class MatriculasService implements IMatriculasService{
    @Autowired
    private MatriculasRepository repoMatriculas;
    
    public List<Matriculas> buscarTodos(){
        // Super Admin ve todas las matrículas
        if (TenantContext.isSuperAdmin()) {
            return repoMatriculas.findAll();
        }
        // Usuario de sede solo ve matrículas de su sede
        return repoMatriculas.findBySedeId(TenantContext.getSedeId());
    }
    
    @Override
    public Matriculas guardar(Matriculas matriculas){
        // Validar que la sección pertenece a la sede del usuario
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = matriculas.getIdSeccion() != null && 
                         matriculas.getIdSeccion().getIdSede() != null
                         ? matriculas.getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para crear matrículas en esta sede");
            }
        }
        return repoMatriculas.save(matriculas);
    }
    
    @Override
    public Matriculas modificar(Matriculas matriculas){
        // Validar que la sección pertenece a la sede del usuario
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = matriculas.getIdSeccion() != null && 
                         matriculas.getIdSeccion().getIdSede() != null
                         ? matriculas.getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para modificar matrículas de esta sede");
            }
        }
        return repoMatriculas.save(matriculas);
    }
    
    public Optional<Matriculas> buscarId(Long id){
        Optional<Matriculas> matricula = repoMatriculas.findById(id);
        
        // Super Admin puede ver cualquier matrícula
        if (TenantContext.isSuperAdmin()) {
            return matricula;
        }
        
        // Usuario de sede solo puede ver matrículas de su sede
        if (matricula.isPresent()) {
            Long sedeId = matricula.get().getIdSeccion() != null && 
                         matricula.get().getIdSeccion().getIdSede() != null
                         ? matricula.get().getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId != null && sedeId.equals(TenantContext.getSedeId())) {
                return matricula;
            }
        }
        return Optional.empty();
    }
    
    public void eliminar(Long id){
        Optional<Matriculas> matricula = repoMatriculas.findById(id);
        if (matricula.isPresent() && !TenantContext.isSuperAdmin()) {
            Long sedeId = matricula.get().getIdSeccion() != null && 
                         matricula.get().getIdSeccion().getIdSede() != null
                         ? matricula.get().getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para eliminar matrículas de esta sede");
            }
        }
        repoMatriculas.deleteById(id);
    }
}