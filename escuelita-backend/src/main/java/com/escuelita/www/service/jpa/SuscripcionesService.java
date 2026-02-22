package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.repository.SuscripcionesRepository;
import com.escuelita.www.service.ISuscripcionesService;

@Service
public class SuscripcionesService implements ISuscripcionesService {
    @Autowired
    private SuscripcionesRepository repo;
    @Override public List<Suscripciones> buscarTodos() { return repo.findAll(); }
    @Override public Suscripciones guardar(Suscripciones s) { return repo.save(s); }
    @Override public Suscripciones modificar(Suscripciones s) { return repo.save(s); }
    @Override public Optional<Suscripciones> buscarId(Long id) { return repo.findById(id); }
    @Override public void eliminar(Long id) { repo.deleteById(id); }
}
