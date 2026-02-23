package com.escuelita.www.service.jpa;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Calificaciones;
import com.escuelita.www.repository.CalificacionesRepository;
import com.escuelita.www.service.ICalificacionesService;

@Service
public class CalificacionesService implements ICalificacionesService {
    @Autowired
    private CalificacionesRepository repoCalificaciones;

    public List<Calificaciones> buscarTodos() { return repoCalificaciones.findAll(); }
    public Calificaciones guardar(Calificaciones calificaciones) { return repoCalificaciones.save(calificaciones); }
    public Calificaciones modificar(Calificaciones calificaciones) { return repoCalificaciones.save(calificaciones); }
    public Optional<Calificaciones> buscarId(Long id) { return repoCalificaciones.findById(id); }
    public void eliminar(Long id) { repoCalificaciones.deleteById(id); }
}