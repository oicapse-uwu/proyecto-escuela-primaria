// No modificado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.PagosCaja;
import com.escuelita.www.entity.PagosCajaDTO;
import com.escuelita.www.entity.MetodosPago;
import com.escuelita.www.entity.Usuarios;
import com.escuelita.www.repository.MetodosPagoRepository;
import com.escuelita.www.repository.UsuariosRepository;

import com.escuelita.www.service.IPagosCajaService;

@RestController
@RequestMapping("/restful")
public class PagosCajaController {
    
    @Autowired
    private IPagosCajaService servicePagosCaja;
    @Autowired
    private MetodosPagoRepository repoMetodosPago;
    @Autowired
    private UsuariosRepository repoUsuarios;

    @GetMapping("/pagoscaja")
    public List<PagosCaja> buscarTodos() {
        return servicePagosCaja.buscarTodos();  
    }
    @PostMapping("/pagoscaja")
    public ResponseEntity<?> guardar(@RequestBody PagosCajaDTO dto) {
        PagosCaja pagosCaja = new PagosCaja();
        pagosCaja.setFechaPago(dto.getFechaPago());
        pagosCaja.setMontoTotalPagado(dto.getMontoTotalPagado());
        pagosCaja.setComprobanteNumero(dto.getComprobanteNumero());
        pagosCaja.setObservacionPago(dto.getObservacionPago());

        MetodosPago metodosPago = repoMetodosPago
            .findById(dto.getIdMetodo())
            .orElse(null);
        Usuarios usuarios = repoUsuarios
            .findById(dto.getIdUsuario())
            .orElse(null);

        pagosCaja.setIdMetodo(metodosPago);
        pagosCaja.setIdUsuario(usuarios);
        
        return ResponseEntity.ok(servicePagosCaja.guardar(pagosCaja));
    }
    @PutMapping("/pagoscaja")
    public ResponseEntity<?> modificar(@RequestBody PagosCajaDTO dto) {
        if(dto.getIdPago() == null){
            return ResponseEntity.badRequest()
                    .body("ID de pago es requerido");
        }
        PagosCaja pagosCaja = new PagosCaja();
        pagosCaja.setIdPago(dto.getIdPago());
        pagosCaja.setFechaPago(dto.getFechaPago());
        pagosCaja.setMontoTotalPagado(dto.getMontoTotalPagado());
        pagosCaja.setComprobanteNumero(dto.getComprobanteNumero());
        pagosCaja.setObservacionPago(dto.getObservacionPago());

        MetodosPago metodosPago = repoMetodosPago
            .findById(dto.getIdMetodo())
            .orElse(null);
        Usuarios usuarios = repoUsuarios
            .findById(dto.getIdUsuario())
            .orElse(null);

        pagosCaja.setIdMetodo(metodosPago);
        pagosCaja.setIdUsuario(usuarios);

        return ResponseEntity.ok(servicePagosCaja.modificar(pagosCaja));
    }
    @GetMapping("/pagoscaja/{id}")
    public Optional<PagosCaja> buscarId(@PathVariable("id") Long id){
    return servicePagosCaja.buscarId(id);
    }
    @DeleteMapping("/pagoscaja/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePagosCaja.eliminar(id);
        return "Pago eliminado correctamente";
    }   
}