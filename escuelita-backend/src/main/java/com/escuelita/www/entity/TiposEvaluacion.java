//CORRECTO

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
@Table(name = "tipos_evaluacion")
@SQLDelete(sql = "UPDATE tipos_evaluacion SET estado=0 WHERE id_tipo_evaluacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idTipoEvaluacion", "nombre", "estado"
})
public class TiposEvaluacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_evaluacion")
    private Long idTipoEvaluacion;

    @Column(length = 100)
    private String nombre;

    @Column(nullable = false)
    private Integer estado = 1;

    public TiposEvaluacion() {}
    public TiposEvaluacion(Long idTipoEvaluacion) {
        this.idTipoEvaluacion = idTipoEvaluacion;
    }

    public Long getIdTipoEvaluacion() {
        return idTipoEvaluacion;
    }
    public void setIdTipoEvaluacion(Long idTipoEvaluacion) {
        this.idTipoEvaluacion = idTipoEvaluacion;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "TiposEvaluacion [idTipoEvaluacion=" + idTipoEvaluacion + ", nombre=" + nombre + ", estado=" + estado + "]";
    }
}