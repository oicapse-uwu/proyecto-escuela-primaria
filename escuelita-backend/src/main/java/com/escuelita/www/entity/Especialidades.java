//CORRECTO

package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.*;

@Entity
@Table(name = "especialidades")
@SQLDelete(sql = "UPDATE especialidades SET estado=0 WHERE id_especialidad=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idEspecialidad", "nombreEspecialidad", "descripcion", "estado"
})
public class Especialidades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_especialidad")
    private Long idEspecialidad;

    @Column(name = "nombre_especialidad")
    private String nombreEspecialidad;
    private String descripcion;

    private Integer estado = 1;

    //Constructor vacio
    public Especialidades() {
    }
    public Especialidades(Long idEspecialidad) {
        this.idEspecialidad = idEspecialidad;
    }

    //Getters y Setters / toString
    public Long getIdEspecialidad() {
        return idEspecialidad;
    }
    public void setIdEspecialidad(Long idEspecialidad) {
        this.idEspecialidad = idEspecialidad;
    }
    public String getNombreEspecialidad() {
        return nombreEspecialidad;
    }
    public void setNombreEspecialidad(String nombreEspecialidad) {
        this.nombreEspecialidad = nombreEspecialidad;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Especialidades [idEspecialidad=" + idEspecialidad + ", nombreEspecialidad=" + nombreEspecialidad
                + ", descripcion=" + descripcion + ", estado=" + estado + "]";
    }
}