package com.escuelita.www.entity;

import java.math.BigDecimal;
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
@Table(name = "conceptos_pago")
@SQLDelete(sql = "UPDATE conceptos_pago SET estado=0 WHERE id_concepto=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idConcepto", "idInstitucion", "idGrado", "nombreConcepto", "monto", "estadoConcepto", "estado"
})
public class ConceptosPago {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_concepto")
    private Long idConcepto;
    
    @Column(name = "id_institucion")
    private Long idInstitucion;
    
    @Column(name = "id_grado")
    private Long idGrado;
    
    @Column(name = "nombre_concepto")
    private String nombreConcepto;
    
    @Column(name = "monto")
    private BigDecimal monto;
    
    @Column(name = "estado_concepto")
    private Integer estadoConcepto = 1;
    
    private Integer estado = 1;

    // Getters y Setters
    public Long getIdConcepto() { return idConcepto; }
    public void setIdConcepto(Long idConcepto) { this.idConcepto = idConcepto; }

    public Long getIdInstitucion() { return idInstitucion; }
    public void setIdInstitucion(Long idInstitucion) { this.idInstitucion = idInstitucion; }

    public Long getIdGrado() { return idGrado; }
    public void setIdGrado(Long idGrado) { this.idGrado = idGrado; }

    public String getNombreConcepto() { return nombreConcepto; }
    public void setNombreConcepto(String nombreConcepto) { this.nombreConcepto = nombreConcepto; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public Integer getEstadoConcepto() { return estadoConcepto; }
    public void setEstadoConcepto(Integer estadoConcepto) { this.estadoConcepto = estadoConcepto; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }

    @Override
    public String toString() {
        return "ConceptosPago [idConcepto=" + idConcepto + ", idInstitucion=" + idInstitucion + 
               ", idGrado=" + idGrado + ", nombreConcepto=" + nombreConcepto + 
               ", monto=" + monto + ", estadoConcepto=" + estadoConcepto + ", estado=" + estado + "]";
    }
}