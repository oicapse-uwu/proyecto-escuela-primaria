package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.CiclosFacturacion;
import com.escuelita.www.service.ICiclosFacturacionService;

@RestController
@RequestMapping("/primaria_bd_real")
public class CiclosFacturacionController {

    @Autowired
    private ICiclosFacturacionService serviceCiclos;

    @GetMapping("/ciclosfacturacion")
    public List<CiclosFacturacion> buscartodos() {
        return serviceCiclos.buscarTodos();
    }

    @PostMapping("/ciclosfacturacion")
    public CiclosFacturacion guardar(@RequestBody CiclosFacturacion ciclo) {
        serviceCiclos.guardar(ciclo);
        return ciclo;
    }

    @PutMapping("/ciclosfacturacion")
    public CiclosFacturacion modificar(@RequestBody CiclosFacturacion ciclo) {
        serviceCiclos.modificar(ciclo);
        return ciclo;
    }

    @GetMapping("/ciclosfacturacion/{id}")
    public Optional<CiclosFacturacion> buscarId(@PathVariable("id") Long id) {
        return serviceCiclos.buscarId(id);
    }

    @DeleteMapping("/ciclosfacturacion/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCiclos.eliminar(id);
        return "Ciclo de facturación eliminado correctamente";
    }
}