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
    "idAlumnoApoderado", "parentesco", "esRepresentanteFinanciero", 
    "viveConEstudiante", "idAlumno", "idApoderado", "estado"
})
public class AlumnoApoderado {
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_alumno")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Alumnos idAlumno;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_apoderado")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Apoderados idApoderado;

    private Integer estado = 1;

    //Constructor vacio
    public AlumnoApoderado() {
    }
    public AlumnoApoderado(Long idAlumnoApoderado) {
        this.idAlumnoApoderado = idAlumnoApoderado;
    }

    //Getters y Setters / ToString
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
    public Alumnos getIdAlumno() {
        return idAlumno;
    }
    public void setIdAlumno(Alumnos idAlumno) {
        this.idAlumno = idAlumno;
    }
    public Apoderados getIdApoderado() {
        return idApoderado;
    }
    public void setIdApoderado(Apoderados idApoderado) {
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
        return "AlumnoApoderado [idAlumnoApoderado=" + idAlumnoApoderado + ", parentesco=" + parentesco
                + ", esRepresentanteFinanciero=" + esRepresentanteFinanciero + ", viveConEstudiante="
                + viveConEstudiante + ", idAlumno=" + idAlumno + ", idApoderado=" + idApoderado
                + ", estado=" + estado + "]";
    }
}