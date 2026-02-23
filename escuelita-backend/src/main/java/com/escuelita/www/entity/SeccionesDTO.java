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
@Table(name = "secciones")
@SQLDelete(sql = "UPDATE secciones SET estado=0 WHERE id_seccion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idSeccion", "nombreSeccion", "vacantes", "estado", "idGrado", "idSede"
})
public class SeccionesDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_seccion")
    private Long idSeccion;
    
    @Column(name = "id_grado")
    private Long idGrado;
    
    @Column(name = "id_sede")
    private Long idSede;
    
    @Column(name = "nombre_seccion", length = 10)
    private String nombreSeccion;
    
    private Integer vacantes;
    private Integer estado = 1;

    //Constructor vacio
    public SeccionesDTO() {}

    //Getters y Setters / ToString
    public Long getIdSeccion() {
        return idSeccion;
    }
    public void setIdSeccion(Long idSeccion) {
        this.idSeccion = idSeccion;
    }
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
    public String getNombreSeccion() {
        return nombreSeccion;
    }
    public void setNombreSeccion(String nombreSeccion) {
        this.nombreSeccion = nombreSeccion;
    }
    public Integer getVacantes() {
        return vacantes;
    }
    public void setVacantes(Integer vacantes) {
        this.vacantes = vacantes;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "SeccionesDTO [idSeccion=" + idSeccion + ", idGrado=" + idGrado + ", idSede=" + idSede
                + ", nombreSeccion=" + nombreSeccion + ", vacantes=" + vacantes + ", estado=" + estado + "]";
    }
}