package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "estados_suscripcion")
@SQLDelete(sql = "UPDATE estados_suscripcion SET estado=0 WHERE id_estado=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idEstado", "nombre", "estado"
})
public class EstadosSuscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado")
    private Long idEstado;

    private String nombre;

    private Integer estado = 1;

    public EstadosSuscripcion() {}

    public EstadosSuscripcion(Long id) {
        this.idEstado = id;
    }

    public Long getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(Long idEstado) {
        this.idEstado = idEstado;
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
        return "EstadosSuscripcion [idEstado=" + idEstado + ", nombre=" + nombre + ", estado=" + estado + "]";
    }


}