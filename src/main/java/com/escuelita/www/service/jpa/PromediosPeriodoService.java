package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.PromediosPeriodo;
import com.escuelita.www.repository.PromediosPeriodoRepository;

@Service
public class PromediosPeriodoService implements IPromediosPeriodoService {

    @Autowired
    private PromediosPeriodoRepository repository;

    @Override
    public List<PromediosPeriodo> buscarTodos() {
        return repository.findAll();
    }

    @Override
    public void guardar(PromediosPeriodo promedio) {
        repository.save(promedio);
    }

    @Override
    public void modificar(PromediosPeriodo promedio) {
        repository.save(promedio);
    }

    @Override
    public Optional<PromediosPeriodo> buscarId(Long id) {
        return repository.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}