package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.TiposNota;
import com.escuelita.www.repository.TiposNotaRepository;

@Service
public class TiposNotaService implements ITiposNotaService {

    @Autowired
    private TiposNotaRepository repository;

    @Override
    public List<TiposNota> buscarTodos() {
        return repository.findAll();
    }

    @Override
    public void guardar(TiposNota tipo) {
        repository.save(tipo);
    }

    @Override
    public void modificar(TiposNota tipo) {
        repository.save(tipo);
    }

    @Override
    public Optional<TiposNota> buscarId(Long id) {
        return repository.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}