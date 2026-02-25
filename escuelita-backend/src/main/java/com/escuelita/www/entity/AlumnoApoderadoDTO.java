package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idAlumnoApoderado", "parentesco", "esRepresentanteFinanciero", 
    "viveConEstudiante", "idAlumno", "idApoderado", "estado"
})

public class AlumnoApoderadoDTO {
    
    private Long idAlumnoApoderado; 
    private String parentesco;
    private Boolean esRepresentanteFinanciero;
    private Boolean viveConEstudiante;
    
    private Long idAlumno;
    private Long idApoderado;
    private Integer estado = 1;

    public Long getIdAlumnoApoderado() {
        return idAlumnoApoderado;
    }
    public void setIdAlumnoApoderado(Long idAlumnoApoderado) {
        this.idAlumnoApoderado = idAlumnoApoderado;
    }
    public String getParentesco() {
        return parentesco;
    }
    public void setParentesco(String parentesco) {
        this.parentesco = parentesco;
    }
    public Boolean getEsRepresentanteFinanciero() {
        return esRepresentanteFinanciero;
    }
    public void setEsRepresentanteFinanciero(Boolean esRepresentanteFinanciero) {
        this.esRepresentanteFinanciero = esRepresentanteFinanciero;
    }
    public Boolean getViveConEstudiante() {
        return viveConEstudiante;
    }
    public void setViveConEstudiante(Boolean viveConEstudiante) {
        this.viveConEstudiante = viveConEstudiante;
    }
    public Long getIdAlumno() {
        return idAlumno;
    }
    public void setIdAlumno(Long idAlumno) {
        this.idAlumno = idAlumno;
    }
    public Long getIdApoderado() {
        return idApoderado;
    }
    public void setIdApoderado(Long idApoderado) {
        this.idApoderado = idApoderado;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "AlumnoApoderadoDTO [idAlumnoApoderado=" + idAlumnoApoderado + ", parentesco=" + parentesco
                + ", esRepresentanteFinanciero=" + esRepresentanteFinanciero + ", viveConEstudiante="
                + viveConEstudiante + ", idAlumno=" + idAlumno + ", idApoderado=" + idApoderado + ", estado=" + estado
                + "]";
    }
}