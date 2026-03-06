package com.escuelita.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.ReniecErrorDTO;
import com.escuelita.www.entity.ReniecResponseDTO;
import com.escuelita.www.service.DecolectaService;

@RestController
@RequestMapping("/api/reniec")
@CrossOrigin(origins = "*")
public class ReniecController {
    
    @Autowired
    private DecolectaService decolectaService;
    
    /**
     * Endpoint para consultar datos de una persona por DNI
     * GET /api/reniec/dni/{numero}
     * 
     * @param dni Número de DNI a consultar
     * @return Datos de la persona o error
     */
    @GetMapping("/dni/{dni}")
    public ResponseEntity<?> consultarDni(@PathVariable String dni) {
        try {
            // Validar formato de DNI peruano (8 dígitos)
            if (dni == null || !dni.matches("\\d{8}")) {
                return ResponseEntity.badRequest()
                    .body(new ReniecErrorDTO("DNI inválido. Debe contener 8 dígitos"));
            }
            
            ReniecResponseDTO response = decolectaService.consultarDni(dni);
            
            if (response == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ReniecErrorDTO("Error al consultar DNI: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ReniecErrorDTO("Error interno del servidor"));
        }
    }
}
