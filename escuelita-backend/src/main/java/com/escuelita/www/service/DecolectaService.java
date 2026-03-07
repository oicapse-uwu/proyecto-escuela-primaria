package com.escuelita.www.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.escuelita.www.entity.ReniecResponseDTO;

@Service
public class DecolectaService {
    
    private final RestTemplate restTemplate;
    
    @Value("${decolecta.api.url}")
    private String apiUrl;
    
    @Value("${decolecta.api.token}")
    private String apiToken;
    
    public DecolectaService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    /**
     * Consulta datos de una persona en RENIEC mediante su DNI
     * @param dni Número de DNI a consultar
     * @return ReniecResponseDTO con los datos de la persona
     * @throws RuntimeException si hay error en la consulta
     */
    public ReniecResponseDTO consultarDni(String dni) {
        try {
            // Construir URL completa
            String url = apiUrl + "/reniec/dni?numero=" + dni;
            
            // Configurar headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiToken);
            
            // Crear entity con headers
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // Hacer petición GET
            ResponseEntity<ReniecResponseDTO> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                ReniecResponseDTO.class
            );
            
            return response.getBody();
            
        } catch (HttpClientErrorException e) {
            // Manejar errores HTTP (400, 401, 404, etc.)
            throw new RuntimeException("Error al consultar DNI en RENIEC: " + e.getMessage(), e);
        } catch (Exception e) {
            // Manejar otros errores
            throw new RuntimeException("Error inesperado al consultar DNI: " + e.getMessage(), e);
        }
    }
}
