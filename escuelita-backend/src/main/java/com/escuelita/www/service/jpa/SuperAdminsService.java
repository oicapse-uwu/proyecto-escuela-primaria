package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.SuperAdmins;
import com.escuelita.www.repository.SuperAdminsRepository;
import com.escuelita.www.service.ISuperAdminsService;

@Service
public class SuperAdminsService implements ISuperAdminsService {

    @Autowired
    private SuperAdminsRepository repoSuperAdmins;

    @Override
    public List<SuperAdmins> buscarTodos() {
        return repoSuperAdmins.findAll();
    }

    @Override
    public void guardar(SuperAdmins superAdmin) {
        repoSuperAdmins.save(superAdmin);
    }

    @Override
    public void modificar(SuperAdmins superAdmin) {
        repoSuperAdmins.save(superAdmin);
    }

    @Override
    public Optional<SuperAdmins> buscarId(Long id) {
        return repoSuperAdmins.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        repoSuperAdmins.deleteById(id);
    }
}