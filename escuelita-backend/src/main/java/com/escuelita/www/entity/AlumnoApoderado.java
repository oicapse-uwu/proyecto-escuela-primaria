package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "alumno_apoderado")
@SQLDelete(sql = "UPDATE alumno_apoderado SET estado=0 WHERE id_alumno_apod=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_alumno_apod", "parentesco", "es_representante_financiero", 
    "vive_con_estudiante", "estado", "id_alumno", "id_apoderado"
})
public class AlumnoApoderado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_alumno_apod; 
    
    @Column(length = 50)
    private String parentesco;
    
    private Boolean es_representante_financiero;
    private Boolean vive_con_estudiante;
    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_alumno")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Long id_alumno;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_apoderado")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Long id_apoderado;
    
    public Long getId_alumno_apod() {
        return id_alumno_apod;
    }
    public void setId_alumno_apod(Long id_alumno_apod) {
        this.id_alumno_apod = id_alumno_apod;
    }
    public String getParentesco() {
        return parentesco;
    }
    public void setParentesco(String parentesco) {
        this.parentesco = parentesco;
    }
    public Boolean getEs_representante_financiero() {
        return es_representante_financiero;
    }
    public void setEs_representante_financiero(Boolean es_representante_financiero) {
        this.es_representante_financiero = es_representante_financiero;
    }
    public Boolean getVive_con_estudiante() {
        return vive_con_estudiante;
    }
    public void setVive_con_estudiante(Boolean vive_con_estudiante) {
        this.vive_con_estudiante = vive_con_estudiante;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    public Long getId_alumno() {
        return id_alumno;
    }
    public void setId_alumno(Long id_alumno) {
        this.id_alumno = id_alumno;
    }
    public Long getId_apoderado() {
        return id_apoderado;
    }
    public void setId_apoderado(Long id_apoderado) {
        this.id_apoderado = id_apoderado;
    }
    @Override
    public String toString() {
        return "AlumnoApoderado [id_alumno_apod=" + id_alumno_apod + ", parentesco=" + parentesco
                + ", es_representante_financiero=" + es_representante_financiero + ", vive_con_estudiante="
                + vive_con_estudiante + ", estado=" + estado + ", id_alumno=" + id_alumno + ", id_apoderado="
                + id_apoderado + "]";
    }
}