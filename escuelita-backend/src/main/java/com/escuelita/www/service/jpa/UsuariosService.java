package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Usuarios;
import com.escuelita.www.repository.UsuariosRepository;
import com.escuelita.www.service.IUsuariosService;

@Service
public class UsuariosService implements IUsuariosService {
    @Autowired
    private UsuariosRepository repoUsuarios;
    
    public List<Usuarios> buscarTodos() {
        return repoUsuarios.findAll();
    }
    @Override
    public Usuarios guardar(Usuarios usuarios) {
        return repoUsuarios.save(usuarios);
    }
    @Override
    public Usuarios modificar(Usuarios usuarios) {
        return repoUsuarios.save(usuarios);
    }
    public Optional<Usuarios> buscarId(Long id) {
        return repoUsuarios.findById(id);
    }
    public void eliminar(Long id) {
        repoUsuarios.deleteById(id);
    }
}