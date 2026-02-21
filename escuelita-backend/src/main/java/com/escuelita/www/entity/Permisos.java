package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "permisos")
@SQLDelete(sql = "UPDATE permisos SET estado=0 WHERE id_permiso=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idPermiso", "nombre", "estado"
})
public class Permisos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso")
    private Long idPermiso;

    private String nombre;

    private Integer estado = 1;

    public Permisos() {}

    public Permisos(Long id) {
        this.idPermiso = id;
    }

    public Long getIdPermiso() {
        return idPermiso;
    }

    public void setIdPermiso(Long idPermiso) {
        this.idPermiso = idPermiso;
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
        return "Permisos [idPermiso=" + idPermiso + ", nombre=" + nombre + ", estado=" + estado + "]";
    }

    

}
