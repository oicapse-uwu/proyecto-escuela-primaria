package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "deudas_alumno")
@SQLDelete(sql = "UPDATE deudas_alumno SET estado=0 WHERE id_deuda=?")
@SQLRestriction("estado = 1")
public class DeudasAlumno {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_deuda")
    private Long idDeuda;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula")
    private Matriculas matricula; 
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_concepto")
    private ConceptosPago concepto;
    
    @Column(name = "descripcion_cuota")
    private String descripcionCuota;
    
    @Column(name = "monto_total")
    private BigDecimal montoTotal;
    
    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;
    
    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;
    
    @Column(name = "estado_deuda")
    private String estadoDeuda = "Pendiente";
    
    @Column(name = "fecha_pago_total")
    private LocalDateTime fechaPagoTotal;
    
    private Integer estado = 1;

    // Getters y Setters
    public Long getIdDeuda() { return idDeuda; }
    public void setIdDeuda(Long idDeuda) { this.idDeuda = idDeuda; }

    public Matriculas getMatricula() { return matricula; }
    public void setMatricula(Matriculas matricula) { this.matricula = matricula; }

    public ConceptosPago getConcepto() { return concepto; }
    public void setConcepto(ConceptosPago concepto) { this.concepto = concepto; }

    public String getDescripcionCuota() { return descripcionCuota; }
    public void setDescripcionCuota(String descripcionCuota) { this.descripcionCuota = descripcionCuota; }

    public BigDecimal getMontoTotal() { return montoTotal; }
    public void setMontoTotal(BigDecimal montoTotal) { this.montoTotal = montoTotal; }

    public LocalDate getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDate fechaEmision) { this.fechaEmision = fechaEmision; }

    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }

    public String getEstadoDeuda() { return estadoDeuda; }
    public void setEstadoDeuda(String estadoDeuda) { this.estadoDeuda = estadoDeuda; }

    public LocalDateTime getFechaPagoTotal() { return fechaPagoTotal; }
    public void setFechaPagoTotal(LocalDateTime fechaPagoTotal) { this.fechaPagoTotal = fechaPagoTotal; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }
}