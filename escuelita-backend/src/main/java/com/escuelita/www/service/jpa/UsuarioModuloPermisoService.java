package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.UsuarioModuloPermiso;
import com.escuelita.www.repository.UsuarioModuloPermisoRepository;
import com.escuelita.www.service.IUsuarioModuloPermisoService;

@Service
public class UsuarioModuloPermisoService implements IUsuarioModuloPermisoService {
    @Autowired
    private UsuarioModuloPermisoRepository repo;
    
    @Override
    public List<UsuarioModuloPermiso> buscarTodos() {
        return repo.findAll();
    }

    @Override
    public List<UsuarioModuloPermiso> buscarPorUsuarioId(Long idUsuario) {
        return repo.findByIdUsuarioActivos(idUsuario);
    }

    @Override
    public List<UsuarioModuloPermiso> buscarPorUsuarioIdOrdenado(Long idUsuario) {
        return repo.findByIdUsuarioOrdenado(idUsuario);
    }

    @Override
    public UsuarioModuloPermiso guardar(UsuarioModuloPermiso usuarioModuloPermiso) {
        return repo.save(usuarioModuloPermiso);
    }

    @Override
    public UsuarioModuloPermiso modificar(UsuarioModuloPermiso usuarioModuloPermiso) {
        return repo.save(usuarioModuloPermiso);
    }

    @Override
    public UsuarioModuloPermiso buscarPorId(Long idUmp) {
        Optional<UsuarioModuloPermiso> resultado = repo.findById(idUmp);
        return resultado.orElse(null);
    }

    @Override
    public void eliminar(Long idUmp) {
        repo.deleteById(idUmp);
    }
}
