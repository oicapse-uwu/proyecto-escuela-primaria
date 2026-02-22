package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.ConceptosPago;
import com.escuelita.www.repository.ConceptosPagoRepository;
import com.escuelita.www.service.IConceptosPagoService;

@Service
public class ConceptosPagoService implements IConceptosPagoService {
    
    @Autowired
    private ConceptosPagoRepository repoConceptos;
    
    public List<ConceptosPago> buscarTodos() {
        return repoConceptos.findAll();
    }
    
    public void guardar(ConceptosPago conceptoPago) {
        repoConceptos.save(conceptoPago);
    }
    
    public void modificar(ConceptosPago conceptoPago) {
        repoConceptos.save(conceptoPago);
    }
    
    public Optional<ConceptosPago> buscarId(Long id) {
        return repoConceptos.findById(id);
    }
    
    public void eliminar(Long id) {
        repoConceptos.deleteById(id);
    }
}