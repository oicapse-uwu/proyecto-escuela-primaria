package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Periodos;
import com.escuelita.www.repository.PeriodosRepository;
import com.escuelita.www.service.IPeriodosService;

@Service
public class PeriodosService implements IPeriodosService{
    @Autowired
    private PeriodosRepository repoPeriodos;
    
    public List<Periodos> buscarTodos(){
        return repoPeriodos.findAll();
    }
    @Override
    public Periodos guardar(Periodos periodo){
        return repoPeriodos.save(periodo);
    }
    @Override
    public Periodos modificar(Periodos periodo){
        return repoPeriodos.save(periodo);
    }
    public Optional<Periodos> buscarId(Long id){
        return repoPeriodos.findById(id);
    }
    public void eliminar(Long id){
        repoPeriodos.deleteById(id);
    }
}