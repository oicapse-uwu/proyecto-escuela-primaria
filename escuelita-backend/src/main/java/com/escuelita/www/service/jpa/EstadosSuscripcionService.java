package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.EstadosSuscripcion;
import com.escuelita.www.repository.EstadosSuscripcionRepository;
import com.escuelita.www.service.IEstadosSuscripcionService;

@Service
public class EstadosSuscripcionService implements IEstadosSuscripcionService {

    @Autowired
    private EstadosSuscripcionRepository repoEstados;

    @Override
    public List<EstadosSuscripcion> buscarTodos() {
        return repoEstados.findAll();
    }

    @Override
    public void guardar(EstadosSuscripcion estadoSuscripcion) {
        repoEstados.save(estadoSuscripcion);
    }

    @Override
    public void modificar(EstadosSuscripcion estadoSuscripcion) {
        repoEstados.save(estadoSuscripcion);
    }

    @Override
    public Optional<EstadosSuscripcion> buscarId(Long id) {
        return repoEstados.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repoEstados.deleteById(id);
    }
}