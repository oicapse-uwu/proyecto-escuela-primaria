package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.RolModuloPermiso;
import com.escuelita.www.repository.RolModuloPermisoRepository;
import com.escuelita.www.service.IRolModuloPermisoService;

@Service
public class RolModuloPermisoService implements IRolModuloPermisoService {

    @Autowired
    private RolModuloPermisoRepository repoRmp;

    @Override
    public List<RolModuloPermiso> buscarTodos() {
        return repoRmp.findAll();
    }

    @Override
    public RolModuloPermiso guardar(RolModuloPermiso rmp) {
        return repoRmp.save(rmp);
    }

    @Override
    public RolModuloPermiso modificar(RolModuloPermiso rmp) {
        return repoRmp.save(rmp);
    }

    @Override
    public Optional<RolModuloPermiso> buscarId(Long id) {
        return repoRmp.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repoRmp.deleteById(id);
    }
}