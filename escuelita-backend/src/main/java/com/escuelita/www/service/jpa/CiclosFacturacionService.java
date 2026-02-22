package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.CiclosFacturacion;
import com.escuelita.www.repository.CiclosFacturacionRepository;
import com.escuelita.www.service.ICiclosFacturacionService;

@Service
public class CiclosFacturacionService implements ICiclosFacturacionService {

    @Autowired
    private CiclosFacturacionRepository repoCiclos;

    @Override
    public List<CiclosFacturacion> buscarTodos() {
        return repoCiclos.findAll();
    }

    @Override
    public void guardar(CiclosFacturacion ciclo) {
        repoCiclos.save(ciclo);
    }

    @Override
    public void modificar(CiclosFacturacion ciclo) {
        repoCiclos.save(ciclo);
    }

    @Override
    public Optional<CiclosFacturacion> buscarId(Long id) {
        return repoCiclos.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repoCiclos.deleteById(id);
    }
}