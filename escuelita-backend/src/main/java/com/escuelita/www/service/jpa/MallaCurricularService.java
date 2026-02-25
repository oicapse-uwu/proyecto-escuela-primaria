package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.MallaCurricular;
import com.escuelita.www.repository.MallaCurricularRepository;
import com.escuelita.www.service.IMallaCurricularService;

@Service
public class MallaCurricularService implements IMallaCurricularService {
    @Autowired
    private MallaCurricularRepository repoMallaCurricular;
    
    public List<MallaCurricular> buscarTodos() {
        return repoMallaCurricular.findAll();
    }
    @Override
    public void guardar(MallaCurricular mallaCurricular) {
        repoMallaCurricular.save(mallaCurricular);
    }
    @Override
    public void modificar(MallaCurricular mallaCurricular) {
        repoMallaCurricular.save(mallaCurricular);
    }
    public Optional<MallaCurricular> buscarId(Long id) {
        return repoMallaCurricular.findById(id);
    }
    public void eliminar(Long id) {
        repoMallaCurricular.deleteById(id);
    }
}