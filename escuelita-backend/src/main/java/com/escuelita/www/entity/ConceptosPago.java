package com.escuelita.www.entity;

import java.math.BigDecimal;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
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
public class ConceptosPago {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_concepto")
    private Long idConcepto;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_institucion")
    private Institucion institucion; 
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grado")
    private Grados grado; 
    
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

    public Institucion getInstitucion() { return institucion; }
    public void setInstitucion(Institucion institucion) { this.institucion = institucion; }

    public Grados getGrado() { return grado; }
    public void setGrado(Grados grado) { this.grado = grado; }

    public String getNombreConcepto() { return nombreConcepto; }
    public void setNombreConcepto(String nombreConcepto) { this.nombreConcepto = nombreConcepto; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public Integer getEstadoConcepto() { return estadoConcepto; }
    public void setEstadoConcepto(Integer estadoConcepto) { this.estadoConcepto = estadoConcepto; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }
}