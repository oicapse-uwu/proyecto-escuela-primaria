package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Registros;
import com.escuelita.www.repository.RegistrosRepository;
import com.escuelita.www.service.IRegistrosService;

@Service
public class RegistrosService implements IRegistrosService{
    @Autowired
    private RegistrosRepository repoRegistros;
    
    public List<Registros> buscarTodos(){
        return repoRegistros.findAll();
    }
    @Override
    public void guardar(Registros registros){
        repoRegistros.save(registros);
    }
    @Override
    public void modificar(Registros registros){
        repoRegistros.save(registros);
    }
    public Optional<Registros> buscarId(Integer id){
        return repoRegistros.findById(id);
    }
    public void eliminar(Integer id){
        repoRegistros.deleteById(id);
    }
}
