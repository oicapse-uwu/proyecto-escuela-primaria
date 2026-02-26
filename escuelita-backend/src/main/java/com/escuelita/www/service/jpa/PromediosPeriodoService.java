package com.escuelita.www.service.jpa;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.PromediosPeriodo;
import com.escuelita.www.repository.PromediosPeriodoRepository;
import com.escuelita.www.service.IPromediosPeriodoService;

@Service
public class PromediosPeriodoService implements IPromediosPeriodoService {
    @Autowired
    private PromediosPeriodoRepository repoPromedios;
    
    public List<PromediosPeriodo> buscarTodos() { 
        return repoPromedios.findAll(); 
    }
    @Override
    public PromediosPeriodo guardar(PromediosPeriodo promediosPeriodo) { 
        return repoPromedios.save(promediosPeriodo); 
    }
    @Override
    public PromediosPeriodo modificar(PromediosPeriodo promediosPeriodo) { 
        return repoPromedios.save(promediosPeriodo); 
    }
    public Optional<PromediosPeriodo> buscarId(Long id) { 
        return repoPromedios.findById(id); 
    }
    public void eliminar(Long id) { 
        repoPromedios.deleteById(id); 
    }
}