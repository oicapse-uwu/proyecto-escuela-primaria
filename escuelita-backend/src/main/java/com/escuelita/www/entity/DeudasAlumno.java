//CORRECTO

package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.*;

@Entity
@Table(name = "deudas_alumno")
@SQLDelete(sql = "UPDATE deudas_alumno SET estado=0 WHERE id_deuda=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idDeuda", "concepto", "descripcionCuota", "montoTotal", "fechaEmision",
    "fechaVencimiento", "estadoDeuda", "fechaPagoTotal", "idMatricula", "estado"
})
public class DeudasAlumno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_deuda")
    private Long idDeuda;
    
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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula")
    private Matriculas idMatricula;

    private Integer estado = 1;

    //Constructor vacio
    public DeudasAlumno() {
    }
    public DeudasAlumno(Long idDeuda) {
        this.idDeuda = idDeuda;
    }

    // Getters y Setters / ToString
    public Long getIdDeuda() {
        return idDeuda;
    }
    public void setIdDeuda(Long idDeuda) {
        this.idDeuda = idDeuda;
    }
    public ConceptosPago getConcepto() {
        return concepto;
    }
    public void setConcepto(ConceptosPago concepto) {
        this.concepto = concepto;
    }
    public String getDescripcionCuota() {
        return descripcionCuota;
    }
    public void setDescripcionCuota(String descripcionCuota) {
        this.descripcionCuota = descripcionCuota;
    }
    public BigDecimal getMontoTotal() {
        return montoTotal;
    }
    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }
    public LocalDate getFechaEmision() {
        return fechaEmision;
    }
    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    public String getEstadoDeuda() {
        return estadoDeuda;
    }
    public void setEstadoDeuda(String estadoDeuda) {
        this.estadoDeuda = estadoDeuda;
    }
    public LocalDateTime getFechaPagoTotal() {
        return fechaPagoTotal;
    }
    public void setFechaPagoTotal(LocalDateTime fechaPagoTotal) {
        this.fechaPagoTotal = fechaPagoTotal;
    }
    public Matriculas getIdMatricula() {
        return idMatricula;
    }
    public void setIdMatricula(Matriculas idMatricula) {
        this.idMatricula = idMatricula;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "DeudasAlumno [idDeuda=" + idDeuda + ", concepto=" + concepto + ", descripcionCuota=" + descripcionCuota
                + ", montoTotal=" + montoTotal + ", fechaEmision=" + fechaEmision + ", fechaVencimiento="
                + fechaVencimiento + ", estadoDeuda=" + estadoDeuda + ", fechaPagoTotal=" + fechaPagoTotal
                + ", idMatricula=" + idMatricula + ", estado=" + estado + "]";
    }
}