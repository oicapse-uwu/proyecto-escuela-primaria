package com.escuelita.www.entity; 

public class AnioEscolarDTO {
    
    private Long idAnioEscolar;
    private Long idSede; 
    private String nombreAnio;
    private Integer activo = 1;
    private Integer estado = 1;

    // Getters y Setters tradicionales
    public Long getIdAnioEscolar() {
        return idAnioEscolar;
    }

    public void setIdAnioEscolar(Long idAnioEscolar) {
        this.idAnioEscolar = idAnioEscolar;
    }

    public Long getIdSede() {
        return idSede;
    }

    public void setIdSede(Long idSede) {
        this.idSede = idSede;
    }

    public String getNombreAnio() {
        return nombreAnio;
    }

    public void setNombreAnio(String nombreAnio) {
        this.nombreAnio = nombreAnio;
    }

    public Integer getActivo() {
        return activo;
    }

    public void setActivo(Integer activo) {
        this.activo = activo;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}