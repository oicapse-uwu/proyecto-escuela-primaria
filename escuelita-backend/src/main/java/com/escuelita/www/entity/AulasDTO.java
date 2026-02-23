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
@Table(name = "aulas")
@SQLDelete(sql = "UPDATE aulas SET estado=0 WHERE id_aula=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idAula", "nombreAula", "capacidad", "estado", "idSede"
})
public class AulasDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aula")
    private Long idAula;
    
    @Column(name = "id_sede")
    private Long idSede;
    
    @Column(name = "nombre_aula", length = 50)
    private String nombreAula;
    
    private Integer capacidad;
    private Integer estado = 1;

    //Constructor vacio
    public AulasDTO() {}

    //Getters y Setters / ToString
    public Long getIdAula() {
        return idAula;
    }
    public void setIdAula(Long idAula) {
        this.idAula = idAula;
    }
    public Long getIdSede() {
        return idSede;
    }
    public void setIdSede(Long idSede) {
        this.idSede = idSede;
    }
    public String getNombreAula() {
        return nombreAula;
    }
    public void setNombreAula(String nombreAula) {
        this.nombreAula = nombreAula;
    }
    public Integer getCapacidad() {
        return capacidad;
    }
    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "AulasDTO [idAula=" + idAula + ", idSede=" + idSede + ", nombreAula=" + nombreAula
                + ", capacidad=" + capacidad + ", estado=" + estado + "]";
    }
}