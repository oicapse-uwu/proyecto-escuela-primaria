package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.AsignacionDocente;
import com.escuelita.www.repository.AsignacionDocenteRepository;
import com.escuelita.www.service.IAsignacionDocenteService;

@Service
public class AsignacionDocenteService implements IAsignacionDocenteService {
    @Autowired
    private AsignacionDocenteRepository repoAsignacionDocente;

    public List<AsignacionDocente> buscarTodos() {
        return repoAsignacionDocente.findAll();
    }
    @Override
    public AsignacionDocente guardar(AsignacionDocente asignacionDocente) {
        return repoAsignacionDocente.save(asignacionDocente);
    }
    @Override
    public AsignacionDocente modificar(AsignacionDocente asignacionDocente) {
        return repoAsignacionDocente.save(asignacionDocente);
    }
    public Optional<AsignacionDocente> buscarId(Long id) {
        return repoAsignacionDocente.findById(id);
    }
    public void eliminar(Long id) {
        repoAsignacionDocente.deleteById(id);
    }
}