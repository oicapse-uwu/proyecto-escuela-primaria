package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.PagoDetalle;
import com.escuelita.www.repository.PagoDetalleRepository;
import com.escuelita.www.service.IPagoDetalleService;

@Service
public class PagoDetalleService implements IPagoDetalleService {
    @Autowired
    private PagoDetalleRepository repoPagoDetalle;

    public List<PagoDetalle> buscarTodos(){
        return repoPagoDetalle.findAll();
    }
    @Override
    public PagoDetalle guardar(PagoDetalle pagoDetalle){
        return repoPagoDetalle.save(pagoDetalle);
    }
    @Override
    public PagoDetalle modificar(PagoDetalle pagoDetalle){
        return repoPagoDetalle.save(pagoDetalle);
    }
    public Optional<PagoDetalle> buscarId(Long id){
        return repoPagoDetalle.findById(id);
    }
    public void eliminar(Long id){
        repoPagoDetalle.deleteById(id);
    }
}