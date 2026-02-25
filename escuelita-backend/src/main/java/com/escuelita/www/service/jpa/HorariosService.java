package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Horarios;
import com.escuelita.www.repository.HorariosRepository;
import com.escuelita.www.service.IHorariosService;

@Service
public class HorariosService implements IHorariosService {
    @Autowired
    private HorariosRepository repoHorarios;
    
    public List<Horarios> buscarTodos() {
        return repoHorarios.findAll();
    }
    @Override
    public Horarios guardar(Horarios horario) {
        return repoHorarios.save(horario);
    }
    @Override
    public Horarios modificar(Horarios horario) {
        return repoHorarios.save(horario);
    }
    public Optional<Horarios> buscarId(Long id) {
        return repoHorarios.findById(id);
    }
    public void eliminar(Long id) {
        repoHorarios.deleteById(id);
    }
}