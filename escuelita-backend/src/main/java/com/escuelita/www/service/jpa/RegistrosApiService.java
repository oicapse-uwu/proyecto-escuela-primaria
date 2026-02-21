package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.RegistrosApi;
import com.escuelita.www.repository.RegistrosApiRepository;
import com.escuelita.www.service.IRegistrosApiService;

@Service
public class RegistrosApiService implements IRegistrosApiService {

    @Autowired
    private RegistrosApiRepository repo;

    @Override
    public List<RegistrosApi> buscarTodos() { return repo.findAll(); }

    @Override
    public RegistrosApi guardar(RegistrosApi r) { return repo.save(r); }

    @Override
    public RegistrosApi modificar(RegistrosApi r) { return repo.save(r); }

    @Override
    public Optional<RegistrosApi> buscarId(Long id) { return repo.findById(id); }

    @Override
    public void eliminar(Long id) { repo.deleteById(id); }
}