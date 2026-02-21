package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "modulos")
@SQLDelete(sql = "UPDATE modulos SET estado=0 WHERE id_modulo=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idModulo", "nombre", "urlBase", "estado"
})
public class Modulos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_modulo")
    private Long idModulo;

    private String nombre;

    @Column(name = "url_base")
    private String urlBase;

    private Integer estado = 1;

    public Modulos() {}

    public Modulos(Long id) {
        this.idModulo = id;
    }

    public Long getIdModulo() {
        return idModulo;
    }

    public void setIdModulo(Long idModulo) {
        this.idModulo = idModulo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getUrlBase() {
        return urlBase;
    }

    public void setUrlBase(String urlBase) {
        this.urlBase = urlBase;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Modulos [idModulo=" + idModulo + ", nombre=" + nombre + ", urlBase=" + urlBase + ", estado=" + estado
                + "]";
    }

  

}