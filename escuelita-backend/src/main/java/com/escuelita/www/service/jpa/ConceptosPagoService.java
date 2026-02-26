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
    private ConceptosPagoRepository repoConceptosPago;
    
    public List<ConceptosPago> buscarTodos(){
        return repoConceptosPago.findAll();
    }

    @Override
    public ConceptosPago guardar(ConceptosPago conceptospago){
       return repoConceptosPago.save(conceptospago);
    }

    @Override
    public ConceptosPago modificar(ConceptosPago conceptospago){
        return repoConceptosPago.save(conceptospago);
    }

    public Optional<ConceptosPago> buscarId(Long id){
        return repoConceptosPago.findById(id);
    }

    public void eliminar(Long id){
        repoConceptosPago.deleteById(id);
    }
}
