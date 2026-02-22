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
@Table(name = "requisitos_documentos")
@SQLDelete(sql = "UPDATE requisitos_documentos SET estado=0 WHERE id_requisito=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_requisito", "nombre_documento", "descripcion",
    "es_obligatorio", "estado"
})
public class RequisitosDocumentos {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_requisito;

    @Column(length = 100)
    private String nombre_documento;

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false)
    private Boolean es_obligatorio;

    @Column(nullable = false)
    private Integer estado;

    //Constructor vacio
    public RequisitosDocumentos() {}
    public RequisitosDocumentos(Long id_requisito) {
        this.id_requisito = id_requisito;
    }

    //Getters y Setters / ToString
    public Long getId_requisito() {
        return id_requisito;
    }
    public void setId_requisito(Long id_requisito) {
        this.id_requisito = id_requisito;
    }
    public String getNombre_documento() {
        return nombre_documento;
    }
    public void setNombre_documento(String nombre_documento) {
        this.nombre_documento = nombre_documento;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public Boolean getEs_obligatorio() {
        return es_obligatorio;
    }
    public void setEs_obligatorio(Boolean es_obligatorio) {
        this.es_obligatorio = es_obligatorio;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "RequisitosDocumentos [id_requisito=" + id_requisito + ", nombre_documento=" + nombre_documento
                + ", descripcion=" + descripcion + ", es_obligatorio=" + es_obligatorio + ", estado=" + estado + "]";
    }
}