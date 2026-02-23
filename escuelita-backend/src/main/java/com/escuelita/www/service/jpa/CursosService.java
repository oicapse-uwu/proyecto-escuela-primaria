package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Cursos;
import com.escuelita.www.repository.CursosRepository;
import com.escuelita.www.service.ICursosService;

@Service
public class CursosService implements ICursosService {

    @Autowired
    private CursosRepository repoCursos;

    @Override
    public List<Cursos> buscarTodos() {
        return repoCursos.findAll();
    }

    @Override
    public Cursos guardar(Cursos curso) {
        return repoCursos.save(curso);
    }

    @Override
    public Cursos modificar(Cursos curso) {
        return repoCursos.save(curso);
    }

    @Override
    public Optional<Cursos> buscarId(Long id) {
        return repoCursos.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repoCursos.deleteById(id);
    }
}