package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Usuarios;
import com.escuelita.www.repository.UsuariosRepository;
import com.escuelita.www.service.IUsuariosService;
import com.escuelita.www.util.SedeAccessHelper;
import com.escuelita.www.util.TenantContext;

@Service
public class UsuariosService implements IUsuariosService {
    @Autowired
    private UsuariosRepository repoUsuarios;
    
    public List<Usuarios> buscarTodos() {
        return SedeAccessHelper.findAllWithSedeFilter(
            repoUsuarios, 
            () -> repoUsuarios.findByIdSedeIdSede(TenantContext.getSedeId())
        );
    }
    
    @Override
    public List<Usuarios> buscarPorSede(Long idSede) {
        return repoUsuarios.findByIdSede_IdSede(idSede);
    }
    @Override
    public Usuarios guardar(Usuarios usuarios) {
        SedeAccessHelper.validateSedeAccess(
            () -> usuarios.getIdSede() != null ? usuarios.getIdSede().getIdSede() : null
        );
        return repoUsuarios.save(usuarios);
    }
    
    @Override
    public Usuarios modificar(Usuarios usuarios) {
        SedeAccessHelper.validateSedeAccess(
            () -> usuarios.getIdSede() != null ? usuarios.getIdSede().getIdSede() : null
        );
        return repoUsuarios.save(usuarios);
    }
    
    public Optional<Usuarios> buscarId(Long id) {
        Optional<Usuarios> usuario = repoUsuarios.findById(id);
        return SedeAccessHelper.filterBySede(
            usuario,
            () -> usuario.isPresent() && usuario.get().getIdSede() != null 
                ? usuario.get().getIdSede().getIdSede() 
                : null
        );
    }
    
    public void eliminar(Long id) {
        Optional<Usuarios> usuario = repoUsuarios.findById(id);
        if (usuario.isPresent()) {
            SedeAccessHelper.validateSedeAccess(
                () -> usuario.get().getIdSede() != null ? usuario.get().getIdSede().getIdSede() : null
            );
        }
        repoUsuarios.deleteById(id);
    }
}
