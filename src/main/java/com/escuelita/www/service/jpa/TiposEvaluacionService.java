package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.TiposEvaluacion;
import com.escuelita.www.repository.TiposEvaluacionRepository;

@Service
public class TiposEvaluacionService implements ITiposEvaluacionService {

    @Autowired
    private TiposEvaluacionRepository repository;

    @Override
    public List<TiposEvaluacion> buscarTodos() {
        return repository.findAll();
    }

    @Override
    public void guardar(TiposEvaluacion tipo) {
        repository.save(tipo);
    }

    @Override
    public void modificar(TiposEvaluacion tipo) {
        repository.save(tipo);
    }

    @Override
    public Optional<TiposEvaluacion> buscarId(Long id) {
        return repository.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}