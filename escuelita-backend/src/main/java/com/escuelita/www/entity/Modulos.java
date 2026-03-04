//CORRECTO

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
    "idModulo", "nombre", "urlBase", "descripcion", "icono", "orden", "estado"
})
public class Modulos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_modulo")
    private Long idModulo;

    private String nombre;
    @Column(name = "url_base")
    private String urlBase;
    
    private String descripcion;
    private String icono;
    private Integer orden;

    private Integer estado = 1;

    //Constructor vacio
    public Modulos() {}
    public Modulos(Long id) {
        this.idModulo = id;
    }

    // Getters y Setters / toString
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
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public String getIcono() {
        return icono;
    }
    public void setIcono(String icono) {
        this.icono = icono;
    }
    public Integer getOrden() {
        return orden;
    }
    public void setOrden(Integer orden) {
        this.orden = orden;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Modulos [idModulo=" + idModulo + ", nombre=" + nombre + ", urlBase=" + urlBase 
                + ", descripcion=" + descripcion + ", icono=" + icono + ", orden=" + orden + ", estado=" + estado + "]";
    }
}