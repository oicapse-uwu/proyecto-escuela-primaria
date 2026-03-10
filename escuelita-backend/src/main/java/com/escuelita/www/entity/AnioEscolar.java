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
@Table(name = "anio_escolar")
@SQLDelete(sql = "UPDATE anio_escolar SET estado=0 WHERE id_anio_escolar=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idAnioEscolar", "nombreAnio", "activo", "idSede", "estado"
})
public class AnioEscolar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_anio_escolar")
    private Long idAnioEscolar;

    @Column(name = "nombre_anio", length = 50)
    private String nombreAnio;

    private Integer activo = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_sede")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Sedes idSede;

    private Integer estado = 1;

    //Constructor vacio
    public AnioEscolar() {
    }
    public AnioEscolar(Long idAnioEscolar) {
        this.idAnioEscolar = idAnioEscolar;
    }

    //Getters y Setters / ToString
    public Long getIdAnioEscolar() {
        return idAnioEscolar;
    }
    public void setIdAnioEscolar(Long idAnioEscolar) {
        this.idAnioEscolar = idAnioEscolar;
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
        return "AnioEscolar [idAnioEscolar=" + idAnioEscolar + ", nombreAnio=" + nombreAnio + ", activo=" + activo
                + ", idSede=" + idSede + ", estado=" + estado + "]";
    }
}