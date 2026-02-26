//CORRECTO

package com.escuelita.www.entity;

import java.math.BigDecimal;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "conceptos_pago")
@SQLDelete(sql = "UPDATE conceptos_pago SET estado=0 WHERE id_concepto=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idConcepto", "nombreConcepto", "monto", "estadoConcepto", "idInstitucion", "idGrado", "estado"
})
public class ConceptosPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_concepto")
    private Long idConcepto;

    @Column(name = "nombre_concepto")
    private String nombreConcepto;
    @Column(name = "monto")
    private BigDecimal monto;
    @Column(name = "estado_concepto")
    private Integer estadoConcepto = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_institucion")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Institucion idInstitucion; 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grado")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Grados idGrado; 

    private Integer estado = 1;

    //Constructor vacio
    public ConceptosPago() {
    }
    public ConceptosPago(Long idConcepto) {
        this.idConcepto = idConcepto;
    }

    // Getters y Setters / toString
    public Long getIdConcepto() {
        return idConcepto;
    }
    public void setIdConcepto(Long idConcepto) {
        this.idConcepto = idConcepto;
    }
    public String getNombreConcepto() {
        return nombreConcepto;
    }
    public void setNombreConcepto(String nombreConcepto) {
        this.nombreConcepto = nombreConcepto;
    }
    public BigDecimal getMonto() {
        return monto;
    }
    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
    public Integer getEstadoConcepto() {
        return estadoConcepto;
    }
    public void setEstadoConcepto(Integer estadoConcepto) {
        this.estadoConcepto = estadoConcepto;
    }
    public Institucion getIdInstitucion() {
        return idInstitucion;
    }
    public void setIdInstitucion(Institucion idInstitucion) {
        this.idInstitucion = idInstitucion;
    }
    public Grados getIdGrado() {
        return idGrado;
    }
    public void setIdGrado(Grados idGrado) {
        this.idGrado = idGrado;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "ConceptosPago [idConcepto=" + idConcepto + ", nombreConcepto=" + nombreConcepto + ", monto=" + monto
                + ", estadoConcepto=" + estadoConcepto + ", idInstitucion=" + idInstitucion + ", idGrado=" + idGrado
                + ", estado=" + estado + "]";
    }
}