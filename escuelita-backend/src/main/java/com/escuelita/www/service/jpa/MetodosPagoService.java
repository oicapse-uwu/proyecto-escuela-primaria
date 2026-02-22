package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.MetodosPago;
import com.escuelita.www.repository.MetodosPagoRepository;
import com.escuelita.www.service.IMetodosPagoService;

@Service
public class MetodosPagoService implements IMetodosPagoService {
    
    @Autowired
    private MetodosPagoRepository repoMetodos;
    
    public List<MetodosPago> buscarTodos() {
        return repoMetodos.findAll();
    }
    
    public void guardar(MetodosPago metodoPago) {
        repoMetodos.save(metodoPago);
    }
    
    public void modificar(MetodosPago metodoPago) {
        repoMetodos.save(metodoPago);
    }
    
    public Optional<MetodosPago> buscarId(Long id) {
        return repoMetodos.findById(id);
    }
    
    public void eliminar(Long id) {
        repoMetodos.deleteById(id);
    }
}