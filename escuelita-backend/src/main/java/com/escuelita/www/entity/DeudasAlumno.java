package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
@Table(name = "deudas_alumno")
@SQLDelete(sql = "UPDATE deudas_alumno SET estado=0 WHERE id_deuda=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idDeuda", "idMatricula", "idConcepto", "descripcionCuota", "montoTotal", 
    "fechaEmision", "fechaVencimiento", "estadoDeuda", "fechaPagoTotal", "estado"
})
public class DeudasAlumno {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_deuda")
    private Long idDeuda;
    
    @Column(name = "id_matricula")
    private Long idMatricula;
    
    @Column(name = "id_concepto")
    private Long idConcepto;
    
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

    public Long getIdMatricula() { return idMatricula; }
    public void setIdMatricula(Long idMatricula) { this.idMatricula = idMatricula; }

    public Long getIdConcepto() { return idConcepto; }
    public void setIdConcepto(Long idConcepto) { this.idConcepto = idConcepto; }

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

    @Override
    public String toString() {
        return "DeudasAlumno [idDeuda=" + idDeuda + ", idMatricula=" + idMatricula + 
               ", idConcepto=" + idConcepto + ", descripcionCuota=" + descripcionCuota + 
               ", montoTotal=" + montoTotal + ", fechaEmision=" + fechaEmision + 
               ", fechaVencimiento=" + fechaVencimiento + ", estadoDeuda=" + estadoDeuda + 
               ", fechaPagoTotal=" + fechaPagoTotal + ", estado=" + estado + "]";
    }
}