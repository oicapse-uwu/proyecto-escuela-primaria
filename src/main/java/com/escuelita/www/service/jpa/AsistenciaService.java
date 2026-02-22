package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Asistencia;
import com.escuelita.www.repository.AsistenciaRepository;

@Service
public class AsistenciaService implements IAsistenciaService {

    @Autowired
    private AsistenciaRepository repository;

    @Override
    public List<Asistencia> buscarTodos() {
        return repository.findAll();
    }

    @Override
    public void guardar(Asistencia asistencia) {
        repository.save(asistencia);
    }

    @Override
    public void modificar(Asistencia asistencia) {
        repository.save(asistencia);
    }

    @Override
    public Optional<Asistencia> buscarId(Long id) {
        return repository.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}