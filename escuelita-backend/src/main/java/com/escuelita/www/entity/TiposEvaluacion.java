package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "tipos_evaluacion")
@SQLDelete(sql = "UPDATE tipos_evaluacion SET estado=0 WHERE id_tipo_evaluacion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_tipo_evaluacion", "nombre", "estado"
})
public class TiposEvaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_tipo_evaluacion;

    @Column(length = 100)
    private String nombre;

    @Column(nullable = false)
    private Integer estado = 1;

    public TiposEvaluacion() {}
    public TiposEvaluacion(Long id_tipo_evaluacion) {
        this.id_tipo_evaluacion = id_tipo_evaluacion;
    }

    public Long getId_tipo_evaluacion() {
        return id_tipo_evaluacion;
    }
    public void setId_tipo_evaluacion(Long id_tipo_evaluacion) {
        this.id_tipo_evaluacion = id_tipo_evaluacion;
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
        return "TiposEvaluacion [id_tipo_evaluacion=" + id_tipo_evaluacion + ", nombre=" + nombre + ", estado=" + estado + "]";
    }
}