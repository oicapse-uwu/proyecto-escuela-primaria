package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.PerfilDocente;
import com.escuelita.www.repository.PerfilDocenteRepository;
import com.escuelita.www.service.IPerfilDocenteService;

@Service
public class PerfilDocenteService implements IPerfilDocenteService {
    @Autowired
    private PerfilDocenteRepository repoPerfilDocente;
    
    public List<PerfilDocente> buscarTodos() {
        return repoPerfilDocente.findAll();
    }
    @Override
    public void guardar(PerfilDocente perfilDocente) {
        repoPerfilDocente.save(perfilDocente);
    }
    @Override
    public void modificar(PerfilDocente perfilDocente) {
        repoPerfilDocente.save(perfilDocente);
    }
    public Optional<PerfilDocente> buscarId(Long id) {
        return repoPerfilDocente.findById(id);
    }
    public void eliminar(Long id) {
        repoPerfilDocente.deleteById(id);
    }
}