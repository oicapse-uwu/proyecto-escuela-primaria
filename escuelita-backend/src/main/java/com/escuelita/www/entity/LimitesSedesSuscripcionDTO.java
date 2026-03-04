package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idLimiteSede", "idSuscripcion", "idSede", "limiteAlumnosAsignado", "estado"
})
public class LimitesSedesSuscripcionDTO {
    
    private Long idLimiteSede;
    private Long idSuscripcion;
    private Long idSede;
    private Integer limiteAlumnosAsignado;
    private Integer estado = 1;
    
    // Constructor vacío
    public LimitesSedesSuscripcionDTO() {
    }
    
    // Getters y Setters
    public Long getIdLimiteSede() {
        return idLimiteSede;
    }
    
    public void setIdLimiteSede(Long idLimiteSede) {
        this.idLimiteSede = idLimiteSede;
    }
    
    public Long getIdSuscripcion() {
        return idSuscripcion;
    }
    
    public void setIdSuscripcion(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }
    
    public Long getIdSede() {
        return idSede;
    }
    
    public void setIdSede(Long idSede) {
        this.idSede = idSede;
    }
    
    public Integer getLimiteAlumnosAsignado() {
        return limiteAlumnosAsignado;
    }
    
    public void setLimiteAlumnosAsignado(Integer limiteAlumnosAsignado) {
        this.limiteAlumnosAsignado = limiteAlumnosAsignado;
    }
    
    public Integer getEstado() {
        return estado;
    }
    
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}
