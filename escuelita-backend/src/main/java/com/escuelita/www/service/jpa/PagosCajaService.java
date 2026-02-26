package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.PagosCaja;
import com.escuelita.www.repository.PagosCajaRepository;
import com.escuelita.www.service.IPagosCajaService;

@Service
public class PagosCajaService implements IPagosCajaService {
    @Autowired
    private PagosCajaRepository repoPagosCaja;

    public List<PagosCaja> buscarTodos() {
        return repoPagosCaja.findAll();
    }
    @Override
    public PagosCaja guardar(PagosCaja usuario) {
        return repoPagosCaja.save(usuario);
    }
    @Override
    public PagosCaja modificar(PagosCaja usuario) {
        return repoPagosCaja.save(usuario);
    }
    public Optional<PagosCaja> buscarId(Long id) {
        return repoPagosCaja.findById(id);
    }
    public void eliminar(Long id) {
        repoPagosCaja.deleteById(id);
    }
}