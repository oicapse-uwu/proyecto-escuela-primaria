package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.MetodosPago;
import com.escuelita.www.service.IMetodosPagoService;

@RestController
@RequestMapping("/restful")
public class MetodosPagoController {

    @Autowired
    private IMetodosPagoService serviceMetodosPago;

    @GetMapping("/metodos-pago")
    public List<MetodosPago> buscarTodos() {
        return serviceMetodosPago.buscarTodos();
    }

    @PostMapping("/metodos-pago")
    public MetodosPago guardar(@RequestBody MetodosPago metodospago) {
        serviceMetodosPago.guardar(metodospago);
        return metodospago;
    }

    @PutMapping("/metodos-pago")
    public MetodosPago modificar(@RequestBody MetodosPago metodospago) {
        serviceMetodosPago.modificar(metodospago);
        return metodospago;
    }

    @GetMapping("/metodos-pago/{id}")
    public Optional<MetodosPago> buscarId(@PathVariable("id") Long id) {
        return serviceMetodosPago.buscarId(id);
    }

    @DeleteMapping("/metodos-pago/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceMetodosPago.eliminar(id);
        return "Metodo de pago eliminado correctamente";
    }
}
