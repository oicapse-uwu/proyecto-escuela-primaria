package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.AlumnosRepository;
import com.escuelita.www.service.IAlumnosService;
import com.escuelita.www.util.TenantContext;

@Service
public class AlumnosService implements IAlumnosService{
    @Autowired
    private AlumnosRepository repoAlumnos;
    
    /**
     * Buscar todos los alumnos.
     * Si el usuario es de escuela, filtra automáticamente por su sede.
     * Si es Super Admin, devuelve todos.
     */
    public List<Alumnos> buscarTodos(){
        Long sedeId = TenantContext.getSedeId();
        
        if (sedeId == null || TenantContext.isSuperAdmin()) {
            // Super Admin o sin sede: ver todos
            return repoAlumnos.findAll();
        }
        
        // Usuario de escuela: solo su sede
        return repoAlumnos.findByIdSedeIdSede(sedeId);
    }
    
    @Override
    public Alumnos guardar(Alumnos alumnos){
        Long sedeId = TenantContext.getSedeId();
        
        // Si el usuario tiene sede, forzar que el alumno pertenezca a esa sede
        if (sedeId != null && !TenantContext.isSuperAdmin()) {
            if (alumnos.getIdSede() == null) {
                // Asignar automáticamente la sede del usuario
                Sedes sede = new Sedes();
                sede.setIdSede(sedeId);
                alumnos.setIdSede(sede);
            } else {
                // Validar que no intente guardar en otra sede
                if (!alumnos.getIdSede().getIdSede().equals(sedeId)) {
                    throw new SecurityException("No puede guardar alumnos en otra sede");
                }
            }
        }
        
        return repoAlumnos.save(alumnos);
    }
    
    @Override
    public Alumnos modificar(Alumnos alumnos){
        Long sedeId = TenantContext.getSedeId();
        
        // Validar que no intente modificar alumno de otra sede
        if (sedeId != null && !TenantContext.isSuperAdmin()) {
            if (alumnos.getIdSede() != null && !alumnos.getIdSede().getIdSede().equals(sedeId)) {
                throw new SecurityException("No puede modificar alumnos de otra sede");
            }
        }
        
        return repoAlumnos.save(alumnos);
    }
    
    public Optional<Alumnos> buscarId(Long id){
        Optional<Alumnos> alumno = repoAlumnos.findById(id);
        Long sedeId = TenantContext.getSedeId();
        
        // Si es usuario de escuela, validar que el alumno sea de su sede
        if (sedeId != null && !TenantContext.isSuperAdmin() && alumno.isPresent()) {
            if (!alumno.get().getIdSede().getIdSede().equals(sedeId)) {
                return Optional.empty(); // No tiene acceso
            }
        }
        
        return alumno;
    }
    
    public void eliminar(Long id){
        Long sedeId = TenantContext.getSedeId();
        
        // Validar que no intente eliminar alumno de otra sede
        if (sedeId != null && !TenantContext.isSuperAdmin()) {
            Optional<Alumnos> alumno = repoAlumnos.findById(id);
            if (alumno.isPresent() && !alumno.get().getIdSede().getIdSede().equals(sedeId)) {
                throw new SecurityException("No puede eliminar alumnos de otra sede");
            }
        }
        
        repoAlumnos.deleteById(id);
    }
}