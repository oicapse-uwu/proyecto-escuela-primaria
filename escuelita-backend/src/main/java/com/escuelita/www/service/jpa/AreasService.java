package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Areas;
import com.escuelita.www.repository.AreasRepository;
import com.escuelita.www.service.IAreasService;

@Service
public class AreasService implements IAreasService {

    @Autowired
    private AreasRepository repoAreas;

    @Override
    public List<Areas> buscarTodos() {
        return repoAreas.findAll();
    }

    @Override
    public void guardar(Areas area) {
        repoAreas.save(area);
    }

    @Override
    public void modificar(Areas area) {
        repoAreas.save(area);
    }

    @Override
    public Optional<Areas> buscarId(Long id) {
        return repoAreas.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repoAreas.deleteById(id);
    }
}