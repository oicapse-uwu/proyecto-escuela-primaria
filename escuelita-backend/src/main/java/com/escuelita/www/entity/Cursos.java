//CORRECTO

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
@Table(name = "cursos")
@SQLDelete(sql = "UPDATE cursos SET estado=0 WHERE id_curso=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idCurso", "nombreCurso", "idArea", "idSede", "estado"
})
public class Cursos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curso")
    private Long idCurso;

    @Column(name = "nombre_curso")
    private String nombreCurso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_area")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Areas idArea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sede")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Sedes idSede;

    private Integer estado = 1;

    //Constructor vacio
    public Cursos() {
    }
    public Cursos(Long idCurso) {
        this.idCurso = idCurso;
    }

    //Getters y Setters / ToString
    public Long getIdCurso() {
        return idCurso;
    }
    public void setIdCurso(Long idCurso) {
        this.idCurso = idCurso;
    }
    public String getNombreCurso() {
        return nombreCurso;
    }
    public void setNombreCurso(String nombreCurso) {
        this.nombreCurso = nombreCurso;
    }
    public Areas getIdArea() {
        return idArea;
    }
    public void setIdArea(Areas idArea) {
        this.idArea = idArea;
    }
    public Sedes getIdSede() {
        return idSede;
    }
    public void setIdSede(Sedes idSede) {
        this.idSede = idSede;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Cursos [idCurso=" + idCurso + ", nombreCurso=" + nombreCurso + 
        ", idArea=" + idArea + ", idSede=" + idSede + ", estado=" + estado + "]";
    }
}