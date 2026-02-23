package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.TiposEvaluacion;
import com.escuelita.www.repository.TiposEvaluacionRepository;
import com.escuelita.www.service.ITiposEvaluacionService;

@Service
public class TiposEvaluacionService implements ITiposEvaluacionService {
    @Autowired
    private TiposEvaluacionRepository repoTiposEvaluacion;

    public List<TiposEvaluacion> buscarTodos() {
        return repoTiposEvaluacion.findAll();
    }
    public TiposEvaluacion guardar(TiposEvaluacion tiposevaluacion) {
        return repoTiposEvaluacion.save(tiposevaluacion);
    }
    public TiposEvaluacion modificar(TiposEvaluacion tiposevaluacion) {
        return repoTiposEvaluacion.save(tiposevaluacion);
    }
    public Optional<TiposEvaluacion> buscarId(Long id) {
        return repoTiposEvaluacion.findById(id);
    }
    public void eliminar(Long id) {
        repoTiposEvaluacion.deleteById(id);
    }
}