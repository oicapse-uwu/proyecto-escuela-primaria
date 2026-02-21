package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Roles;
import com.escuelita.www.repository.RolesRepository;
import com.escuelita.www.service.IRolesService;

@Service
public class RolesService implements IRolesService {

    @Autowired
    private RolesRepository repoRoles;

    @Override
    public List<Roles> buscarTodos() {
        return repoRoles.findAll();
    }

    @Override
    public void guardar(Roles rol) {
        repoRoles.save(rol);
    }

    @Override
    public void modificar(Roles rol) {
        repoRoles.save(rol);
    }

    @Override
    public Optional<Roles> buscarId(Long id) {
        return repoRoles.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repoRoles.deleteById(id);
    }
}
