package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Evaluaciones;
import com.escuelita.www.repository.EvaluacionesRepository;
import com.escuelita.www.service.IEvaluacionesService;

@Service
public class EvaluacionesService implements IEvaluacionesService {
    @Autowired
    private EvaluacionesRepository repoEvaluaciones;

    public List<Evaluaciones> buscarTodos() {
        return repoEvaluaciones.findAll();
    }
    @Override
    public Evaluaciones guardar(Evaluaciones evaluacion) {
        return repoEvaluaciones.save(evaluacion);
    }
    @Override
    public Evaluaciones modificar(Evaluaciones evaluacion) {
        return repoEvaluaciones.save(evaluacion);
    }
    public Optional<Evaluaciones> buscarId(Long id) {
        return repoEvaluaciones.findById(id);
    }
    public void eliminar(Long id) {
        repoEvaluaciones.deleteById(id);
    }
}