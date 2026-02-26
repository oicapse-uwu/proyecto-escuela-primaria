package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Especialidades;
import com.escuelita.www.repository.EspecialidadesRepository;
import com.escuelita.www.service.IEspecialidadesService;

@Service
public class EspecialidadesService implements IEspecialidadesService {
    @Autowired
    private EspecialidadesRepository repoEspecialidades;

    public List<Especialidades> buscarTodos() {
        return repoEspecialidades.findAll();
    }
    @Override
    public void guardar(Especialidades especialidades) {
        repoEspecialidades.save(especialidades); 
    }
    @Override
    public void modificar(Especialidades especialidades) {
        repoEspecialidades.save(especialidades);
    }
    public Optional<Especialidades> buscarId(Long id) {
        return repoEspecialidades.findById(id);
    }
    public void eliminar(Long id) {
        repoEspecialidades.deleteById(id);
    }
}