package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.DeudasAlumno;
import com.escuelita.www.repository.DeudasAlumnoRepository;
import com.escuelita.www.service.IDeudasAlumnoService;

@Service
public class DeudasAlumnoService implements IDeudasAlumnoService {
    
    @Autowired
    private DeudasAlumnoRepository repoDeudasAlumno;

    @Override
    public List<DeudasAlumno> buscarTodos() {
        return repoDeudasAlumno.findAll();
    }

    @Override
    public DeudasAlumno guardar(DeudasAlumno usuario) {
        return repoDeudasAlumno.save(usuario);
    }

    @Override
    public DeudasAlumno modificar(DeudasAlumno usuario) {
        return repoDeudasAlumno.save(usuario);
    }

    @Override
    public Optional<DeudasAlumno> buscarId(Long id) {
        return repoDeudasAlumno.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repoDeudasAlumno.deleteById(id);
    }
}