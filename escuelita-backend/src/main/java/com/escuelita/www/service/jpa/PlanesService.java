package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Planes;
import com.escuelita.www.repository.PlanesRepository;
import com.escuelita.www.service.IPlanesService;

@Service
public class PlanesService implements IPlanesService {

    @Autowired
    private PlanesRepository repoPlanes;

    @Override
    public List<Planes> buscarTodos() {
        return repoPlanes.findAll();
    }

    @Override
    public void guardar(Planes plan) {
        repoPlanes.save(plan);
    }

    @Override
    public void modificar(Planes plan) {
        repoPlanes.save(plan);
    }

    @Override
    public Optional<Planes> buscarId(Long id) {
        return repoPlanes.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repoPlanes.deleteById(id);
    }
}