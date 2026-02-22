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
    
    public List<DeudasAlumno> buscarTodos() {
        return repoDeudasAlumno.findAll();
    }
    
    public void guardar(DeudasAlumno deudaAlumno) {
        repoDeudasAlumno.save(deudaAlumno);
    }
    
    public void modificar(DeudasAlumno deudaAlumno) {
        repoDeudasAlumno.save(deudaAlumno);
    }
    
    public Optional<DeudasAlumno> buscarId(Long id) {
        return repoDeudasAlumno.findById(id);
    }
    
    public void eliminar(Long id) {
        repoDeudasAlumno.deleteById(id);
    }
}