package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "permisos")
@SQLDelete(sql = "UPDATE permisos SET estado=0 WHERE id_permiso=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idPermiso", "nombre", "codigo", "descripcion", "idModulo", "estado"
})
public class Permisos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso")
    private Long idPermiso;

    private String nombre;
    private String codigo;
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_modulo")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Modulos idModulo;

    private Integer estado = 1;

    //Constructor vacio
    public Permisos() {
    }
    public Permisos(Long id) {
        this.idPermiso = id;
    }

    //Getters y Setters / ToString
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
    public String getCodigo() {
        return codigo;
    }
    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public Modulos getIdModulo() {
        return idModulo;
    }
    public void setIdModulo(Modulos idModulo) {
        this.idModulo = idModulo;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Permisos [idPermiso=" + idPermiso + ", nombre=" + nombre + ", codigo=" + codigo 
                + ", descripcion=" + descripcion + ", idModulo=" + idModulo + ", estado=" + estado + "]";
    }
}
