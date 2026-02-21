package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.*;
import com.escuelita.www.repository.SuperAdminsRepository;
import com.escuelita.www.service.IRegistrosApiService;

@RestController
@RequestMapping("/restful")
public class RegistrosApiController {

    @Autowired
    private IRegistrosApiService serviceApi;

    @Autowired
    private SuperAdminsRepository repoAdmin;

    @GetMapping("/registrosapi")
    public List<RegistrosApi> buscartodos() {
        return serviceApi.buscarTodos();
    }

    @PostMapping("/registrosapi")
    public ResponseEntity<?> guardar(@RequestBody RegistrosApiDTO dto) {
        RegistrosApi registro = new RegistrosApi();
        mapear(registro, dto);
        
        registro.setIdAdmin(repoAdmin.findById(dto.getIdAdmin()).orElse(null));

        return ResponseEntity.ok(serviceApi.guardar(registro));
    }

    @PutMapping("/registrosapi")
    public ResponseEntity<?> modificar(@RequestBody RegistrosApiDTO dto) {
        if(dto.getIdRegistro() == null) return ResponseEntity.badRequest().body("ID Registro requerido");
        
        RegistrosApi registro = new RegistrosApi();
        registro.setIdRegistro(dto.getIdRegistro());
        mapear(registro, dto);
        
        registro.setIdAdmin(new SuperAdmins(dto.getIdAdmin()));

        return ResponseEntity.ok(serviceApi.modificar(registro));
    }

    private void mapear(RegistrosApi r, RegistrosApiDTO dto) {
        r.setTokenGenerado(dto.getTokenGenerado());
        r.setClaveSecreta(dto.getClaveSecreta());
        r.setDescripcion(dto.getDescripcion());
        r.setFechaEmision(dto.getFechaEmision());
        r.setFechaExpiracion(dto.getFechaExpiracion());
        r.setEstadoToken(dto.getEstadoToken());
    }

    @GetMapping("/registrosapi/{id}")
    public Optional<RegistrosApi> buscarId(@PathVariable Long id) {
        return serviceApi.buscarId(id);
    }

    @DeleteMapping("/registrosapi/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceApi.eliminar(id);
        return "Registro API eliminado";
    }
}