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

    @Override
    public List<PerfilDocente> buscarTodos() {
        return repoPerfilDocente.findAll();
    }

    @Override
    public void guardar(PerfilDocente docente) {
        repoPerfilDocente.save(docente);
    }

    @Override
    public void modificar(PerfilDocente docente) {
        repoPerfilDocente.save(docente);
    }

    @Override
    public Optional<PerfilDocente> buscarId(Long id) {
        return repoPerfilDocente.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repoPerfilDocente.deleteById(id);
    }
}