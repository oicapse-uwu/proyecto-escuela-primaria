// Sin modificar
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.MetodosPago;
import com.escuelita.www.service.IMetodosPagoService;
import com.escuelita.www.security.RequireModulo;

@RestController
@RequestMapping("/restful")
public class MetodosPagoController {

    @Autowired
    private IMetodosPagoService serviceMetodosPago;

    @GetMapping("/metodospago")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public List<MetodosPago> buscarTodos() {
        return serviceMetodosPago.buscarTodos();
    }
    @PostMapping("/metodospago")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public MetodosPago guardar(@RequestBody MetodosPago metodosPago) {
        serviceMetodosPago.guardar(metodosPago);
        return metodosPago;
    }
    @PutMapping("/metodospago")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public MetodosPago modificar(@RequestBody MetodosPago metodosPago) {
        serviceMetodosPago.modificar(metodosPago);
        return metodosPago;
    }
    @GetMapping("/metodospago/{id}")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public Optional<MetodosPago> buscarId(@PathVariable("id") Long id) {
        return serviceMetodosPago.buscarId(id);
    }
    @DeleteMapping("/metodospago/{id}")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public String eliminar(@PathVariable Long id) {
        serviceMetodosPago.eliminar(id);
        return "Metodo de pago eliminado correctamente";
    }
}