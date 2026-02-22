package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Evaluacion;
import com.escuelita.www.repository.EvaluacionRepository;

@Service
public class EvaluacionService implements IEvaluacionService {

    @Autowired
    private EvaluacionRepository repository;

    @Override
    public List<Evaluacion> buscarTodos() {
        return repository.findAll();
    }

    @Override
    public void guardar(Evaluacion evaluacion) {
        repository.save(evaluacion);
    }

    @Override
    public void modificar(Evaluacion evaluacion) {
        repository.save(evaluacion);
    }

    @Override
    public Optional<Evaluacion> buscarId(Long id) {
        return repository.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}