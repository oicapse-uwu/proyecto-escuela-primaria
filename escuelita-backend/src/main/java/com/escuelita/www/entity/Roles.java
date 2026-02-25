//CORRECTO

package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "roles")
@SQLDelete(sql = "UPDATE roles SET estado=0 WHERE id_rol=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idRol", "nombre", "estado"
})
public class Roles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long idRol;

    private String nombre;

    private Integer estado = 1;

    // Constructor vacio
    public Roles() {}
    public Roles(Long id) {
        this.idRol = id;
    }

    // Getters y Setters / toString
    public Long getIdRol() {
        return idRol;
    }
    public void setIdRol(Long idRol) {
        this.idRol = idRol;
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
        return "Roles [idRol=" + idRol + ", nombre=" + nombre + ", estado=" + estado + "]";
    }
}
