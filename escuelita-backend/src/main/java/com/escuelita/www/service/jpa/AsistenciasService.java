package com.escuelita.www.service.jpa;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelita.www.entity.Asistencias;
import com.escuelita.www.repository.AsistenciasRepository;
import com.escuelita.www.service.IAsistenciasService;

@Service
public class AsistenciasService implements IAsistenciasService {
    @Autowired
    private AsistenciasRepository repoAsistencias;
    
    @Transactional(readOnly = true)
    public List<Asistencias> buscarTodos() { 
        return repoAsistencias.findAll(); 
    }
    @Override
    public Asistencias guardar(Asistencias asistencias) { 
        return repoAsistencias.save(asistencias); 
    }
    @Override
    public Asistencias modificar(Asistencias asistencias) { 
        return repoAsistencias.save(asistencias); 
    }
    @Transactional(readOnly = true)
    public Optional<Asistencias> buscarId(Long id) { 
        return repoAsistencias.findById(id); 
    }
    public void eliminar(Long id) { 
        repoAsistencias.deleteById(id); 
    }
}