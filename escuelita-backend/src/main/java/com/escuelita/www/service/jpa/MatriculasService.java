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
    public void guardar(Matriculas matricula){
        repoMatriculas.save(matricula);
    }
    public void modificar(Matriculas matricula){
        repoMatriculas.save(matricula);
    }
    public Optional<Matriculas> buscarId(Long id){
        return repoMatriculas.findById(id);
    }
    public void eliminar(Long id){
        repoMatriculas.deleteById(id);
    }
}