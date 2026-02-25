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
@Table(name = "aulas")
@SQLDelete(sql = "UPDATE aulas SET estado=0 WHERE id_aula=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idAula", "nombreAula", "capacidad", "idSede", "estado"
})
public class Aulas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aula")
    private Long idAula;

    @Column(name = "nombre_aula", length = 50)
    private String nombreAula;
    private Integer capacidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sede", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Sedes idSede;

    private Integer estado = 1;

    //Constructor vacio
    public Aulas() {
    }
    public Aulas(Long idAula) {
        this.idAula = idAula;
    }

    //Getters y Setters / ToString
    public Long getIdAula() {
        return idAula;
    }
    public void setIdAula(Long idAula) {
        this.idAula = idAula;
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
        return "Aulas [idAula=" + idAula + ", nombreAula=" + nombreAula + ", capacidad=" + capacidad + 
        ", idSede=" + idSede + ", estado=" + estado + "]";
    }
}