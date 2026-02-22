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
    
    public void guardar(PagosCaja pagoCaja) {
        repoPagosCaja.save(pagoCaja);
    }
    
    public void modificar(PagosCaja pagoCaja) {
        repoPagosCaja.save(pagoCaja);
    }
    
    public Optional<PagosCaja> buscarId(Long id) {
        return repoPagosCaja.findById(id);
    }
    
    public void eliminar(Long id) {
        repoPagosCaja.deleteById(id);
    }
}