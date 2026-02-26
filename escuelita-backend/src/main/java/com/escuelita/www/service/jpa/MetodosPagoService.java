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
    private MetodosPagoRepository repoMetodosPago;

    public List<MetodosPago> buscarTodos() {
        return repoMetodosPago.findAll();
    }
    @Override
    public void guardar(MetodosPago rol) {
        repoMetodosPago.save(rol);
    }
    @Override
    public void modificar(MetodosPago rol) {
        repoMetodosPago.save(rol);
    }
    public Optional<MetodosPago> buscarId(Long id) {
        return repoMetodosPago.findById(id);
    }
    public void eliminar(Long id) {
        repoMetodosPago.deleteById(id);
    }
}