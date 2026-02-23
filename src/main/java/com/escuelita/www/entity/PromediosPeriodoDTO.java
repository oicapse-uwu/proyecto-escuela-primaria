package com.escuelita.www.dto;

public class PromediosPeriodoDTO {

    private Long idPromedio;
    private Long idMatricula;
    private Long idPeriodo;
    private String promedio;
    private String observacion;

  

    public Long getIdPromedio() {
        return idPromedio;
    }

    public void setIdPromedio(Long idPromedio) {
        this.idPromedio = idPromedio;
    }

    public Long getIdMatricula() {
        return idMatricula;
    }

    public void setIdMatricula(Long idMatricula) {
        this.idMatricula = idMatricula;
    }

    public Long getIdPeriodo() {
        return idPeriodo;
    }

    public void setIdPeriodo(Long idPeriodo) {
        this.idPeriodo = idPeriodo;
    }

    public String getPromedio() {
        return promedio;
    }

    public void setPromedio(String promedio) {
        this.promedio = promedio;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    @Override
    public String toString() {
        return "PromediosPeriodoDTO [idPromedio=" + idPromedio + ", idMatricula=" + idMatricula + ", idPeriodo="
                + idPeriodo + ", promedio=" + promedio + ", observacion=" + observacion + "]";
    }
    
}