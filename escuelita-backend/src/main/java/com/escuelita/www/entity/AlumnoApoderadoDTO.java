package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "alumno_apoderado")
@SQLDelete(sql = "UPDATE alumno_apoderado SET estado=0 WHERE id_alum_apod=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idAlumnoApoderado", "parentesco", "esRepresentanteFinanciero", 
    "viveConEstudiante", "estado", "idAlumno", "idApoderado"
})
public class AlumnoApoderadoDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alum_apod")
    private Long idAlumnoApoderado; 
    
    @Column(length = 50)
    private String parentesco;
    
    @Column(name = "es_representante_financiero")
    private Boolean esRepresentanteFinanciero;
    @Column(name = "vive_con_estudiante")
    private Boolean viveConEstudiante;
    @Column(name = "id_alumno")
    private Long idAlumno;
    @Column(name = "id_apoderado")
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