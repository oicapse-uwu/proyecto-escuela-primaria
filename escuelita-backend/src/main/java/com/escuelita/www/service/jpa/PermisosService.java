package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Permisos;
import com.escuelita.www.repository.PermisosRepository;
import com.escuelita.www.service.IPermisosService;

@Service
public class PermisosService implements IPermisosService {
    @Autowired
    private PermisosRepository repoPermisos;
    
    public List<Permisos> buscarTodos() {
        return repoPermisos.findAll();
    }
    @Override
    public void guardar(Permisos permisos) {
        repoPermisos.save(permisos);
    }
    @Override
    public void modificar(Permisos permisos) {
        repoPermisos.save(permisos);
    }
    public Optional<Permisos> buscarId(Long id) {
        return repoPermisos.findById(id);
    }
    public void eliminar(Long id) {
        repoPermisos.deleteById(id);
    }
}