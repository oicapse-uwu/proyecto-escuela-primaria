package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelita.www.entity.PagoSuscripcion;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.repository.PagoSuscripcionRepository;
import com.escuelita.www.repository.SuscripcionesRepository;
import com.escuelita.www.service.ISuscripcionesService;

@Service
public class SuscripcionesService implements ISuscripcionesService {
    @Autowired
    private SuscripcionesRepository repo;
    
    @Autowired
    private PagoSuscripcionRepository pagoRepository;
    
    public List<Suscripciones> buscarTodos() { 
        return repo.findAll(); 
    }
    @Override 
    public Suscripciones guardar(Suscripciones suscripciones) { 
        return repo.save(suscripciones); 
    }
    @Override 
    public Suscripciones modificar(Suscripciones suscripciones) { 
        return repo.save(suscripciones); 
    }
    public Optional<Suscripciones> buscarId(Long id) { 
        return repo.findById(id); 
    }
    
    @Transactional
    public void eliminar(Long id) {
        // Primero eliminar todos los pagos asociados a esta suscripción
        List<PagoSuscripcion> pagos = pagoRepository.findBySuscripcionIdOrderByFechaPagoDesc(id);
        if (!pagos.isEmpty()) {
            System.out.println("🗑️ Eliminando " + pagos.size() + " pagos asociados a la suscripción ID: " + id);
            pagoRepository.deleteAll(pagos);
        }
        // Luego eliminar la suscripción
        repo.deleteById(id); 
    }
}
