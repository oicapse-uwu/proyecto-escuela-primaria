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
@Table(name = "grados")
@SQLDelete(sql = "UPDATE grados SET estado=0 WHERE id_grado=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idGrado", "nombreGrado", "estado", "idSede"
})

public class GradosDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grado")
    private Long idGrado;
    
    @Column(name = "id_sede")
    private Long idSede;
    
    @Column(name = "nombre_grado", length = 50)
    private String nombreGrado;
    
    private Integer estado = 1;

    //Constructor vacio
    public GradosDTO() {}

    //Getters y Setters / ToString
    public Long getIdGrado() {
        return idGrado;
    }
    public void setIdGrado(Long idGrado) {
        this.idGrado = idGrado;
    }
    public Long getIdSede() {
        return idSede;
    }
    public void setIdSede(Long idSede) {
        this.idSede = idSede;
    }
    public String getNombreGrado() {
        return nombreGrado;
    }
    public void setNombreGrado(String nombreGrado) {
        this.nombreGrado = nombreGrado;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "GradosDTO [idGrado=" + idGrado + ", idSede=" + idSede + ", nombreGrado=" + nombreGrado
                + ", estado=" + estado + "]";
    }
}