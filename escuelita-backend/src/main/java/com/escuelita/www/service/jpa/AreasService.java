package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Areas;
import com.escuelita.www.repository.AreasRepository;
import com.escuelita.www.service.IAreasService;

@Service
public class AreasService implements IAreasService {
    @Autowired
    private AreasRepository repoAreas;

    public List<Areas> buscarTodos() {
        // Las áreas son globales, se devuelven todas sin filtrar por sede
        return repoAreas.findAll();
    }
    
    @Override
    public Areas guardar(Areas areas) {
        // Las áreas son globales, no requieren validación de sede
        return repoAreas.save(areas);
    }
    
    @Override
    public Areas modificar(Areas areas) {
        // Las áreas son globales, no requieren validación de sede
        return repoAreas.save(areas);
    }
    
    public Optional<Areas> buscarId(Long id) {
        // Las áreas son globales, se devuelven sin filtrar por sede
        return repoAreas.findById(id);
    }
    
    public void eliminar(Long id) {
        // Las áreas son globales, no requieren validación de sede
        repoAreas.deleteById(id);
    }
}