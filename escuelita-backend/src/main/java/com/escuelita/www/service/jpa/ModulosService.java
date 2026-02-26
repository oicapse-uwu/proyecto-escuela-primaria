package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Modulos;
import com.escuelita.www.repository.ModulosRepository;
import com.escuelita.www.service.IModulosService;

@Service
public class ModulosService implements IModulosService {
    @Autowired
    private ModulosRepository repoModulos;
    
    public List<Modulos> buscarTodos() {
        return repoModulos.findAll();
    }
    @Override
    public void guardar(Modulos modulos) {
        repoModulos.save(modulos);
    }
    @Override
    public void modificar(Modulos modulos) {
        repoModulos.save(modulos);
    }
    public Optional<Modulos> buscarId(Long id) {
        return repoModulos.findById(id);
    }
    public void eliminar(Long id) {
        repoModulos.deleteById(id);
    }
}