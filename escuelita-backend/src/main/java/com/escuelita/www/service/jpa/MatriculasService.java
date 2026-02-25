package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.repository.MatriculasRepository;
import com.escuelita.www.service.IMatriculasService;

@Service
public class MatriculasService implements IMatriculasService{
    @Autowired
    private MatriculasRepository repoMatriculas;
    
    public List<Matriculas> buscarTodos(){
        return repoMatriculas.findAll();
    }
    @Override
    public Matriculas guardar(Matriculas matriculas){
        return repoMatriculas.save(matriculas);
    }
    @Override
    public Matriculas modificar(Matriculas matriculas){
        return repoMatriculas.save(matriculas);
    }
    public Optional<Matriculas> buscarId(Long id){
        return repoMatriculas.findById(id);
    }
    public void eliminar(Long id){
        repoMatriculas.deleteById(id);
    }
}