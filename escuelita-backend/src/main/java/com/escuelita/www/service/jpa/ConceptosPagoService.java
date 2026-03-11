package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.ConceptosPago;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.ConceptosPagoRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.IConceptosPagoService;
import com.escuelita.www.util.TenantContext;

@Service
public class ConceptosPagoService implements IConceptosPagoService {
    @Autowired
    private ConceptosPagoRepository repoConceptosPago;
    @Autowired
    private SedesRepository repoSedes;
    
    public List<ConceptosPago> buscarTodos(){
        Long sedeId = TenantContext.getSedeId();
        if (sedeId == null || TenantContext.isSuperAdmin()) {
            return repoConceptosPago.findAll();
        }
        Sedes sede = repoSedes.findById(sedeId).orElse(null);
        if (sede == null || sede.getIdInstitucion() == null) {
            return repoConceptosPago.findAll();
        }
        return repoConceptosPago.findByIdInstitucionIdInstitucion(sede.getIdInstitucion().getIdInstitucion());
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
