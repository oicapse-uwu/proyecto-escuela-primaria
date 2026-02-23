package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Calificaciones;
import com.escuelita.www.repository.CalificacionesRepository;

@Service
public class CalificacionesService implements ICalificacionesService {

    @Autowired
    private CalificacionesRepository repository;

    @Override
    public List<Calificaciones> buscarTodos() {
        return repository.findAll();
    }

    @Override
    public void guardar(Calificaciones calificacion) {
        repository.save(calificacion);
    }

    @Override
    public void modificar(Calificaciones calificacion) {
        repository.save(calificacion);
    }

    @Override
    public Optional<Calificaciones> buscarId(Long id) {
        return repository.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}