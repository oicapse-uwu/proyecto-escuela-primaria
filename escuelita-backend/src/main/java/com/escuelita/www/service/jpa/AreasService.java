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

    public List<Areas> buscarTodos() {
        return repoAreas.findAll();
    }
    @Override
    public void guardar(Areas areas) {
        repoAreas.save(areas);
    }
    @Override
    public void modificar(Areas areas) {
        repoAreas.save(areas);
    }
    public Optional<Areas> buscarId(Long id) {
        return repoAreas.findById(id);
    }
    public void eliminar(Long id) {
        repoAreas.deleteById(id);
    }
}