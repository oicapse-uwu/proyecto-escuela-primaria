//CORRECTO

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
    "idRequisito", "nombreDocumento", "descripcion",
    "esObligatorio", "estado"
})
public class RequisitosDocumentos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_requisito")
    private Long idRequisito;

    @Column(name = "nombre_documento", length = 100)
    private String nombreDocumento;
    @Column(length = 255)
    private String descripcion;
    @Column(name = "es_obligatorio", nullable = false)
    private Boolean esObligatorio;

    private Integer estado = 1;

    //Constructor vacio
    public RequisitosDocumentos() {}
    public RequisitosDocumentos(Long idRequisito) {
        this.idRequisito = idRequisito;
    }

    //Getters y Setters / ToString
    public Long getIdRequisito() {
        return idRequisito;
    }
    public void setIdRequisito(Long idRequisito) {
        this.idRequisito = idRequisito;
    }
    public String getNombreDocumento() {
        return nombreDocumento;
    }
    public void setNombreDocumento(String nombreDocumento) {
        this.nombreDocumento = nombreDocumento;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public Boolean getEsObligatorio() {
        return esObligatorio;
    }
    public void setEsObligatorio(Boolean esObligatorio) {
        this.esObligatorio = esObligatorio;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "RequisitosDocumentos [idRequisito=" + idRequisito + ", nombreDocumento=" + nombreDocumento
                + ", descripcion=" + descripcion + ", esObligatorio=" + esObligatorio + ", estado=" + estado + "]";
    }
}