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
    
    public List<RolModuloPermiso> buscarTodos() {
        return repoRmp.findAll();
    }
    @Override
    public List<RolModuloPermiso> buscarPorRoles(List<Long> roleIds) {
        return repoRmp.findByIdRol_IdRolIn(roleIds);
    }
    @Override
    public List<RolModuloPermiso> buscarPorRolId(Long idRol) {
        return repoRmp.findByIdRol_IdRol(idRol);
    }
    @Override
    public List<RolModuloPermiso> buscarPorRolIdOrdenado(Long idRol) {
        return repoRmp.findByIdRolOrdenado(idRol);
    }
    @Override
    public RolModuloPermiso guardar(RolModuloPermiso rolModuloPermiso) {
        return repoRmp.save(rolModuloPermiso);
    }
    @Override
    public RolModuloPermiso modificar(RolModuloPermiso rolModuloPermiso) {
        return repoRmp.save(rolModuloPermiso);
    }
    public Optional<RolModuloPermiso> buscarId(Long id) {
        return repoRmp.findById(id);
    }
    public void eliminar(Long id) {
        repoRmp.deleteById(id);
    }
}