package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class DeudasAlumnoDTO {
    
    private Long idDeuda;
    private Long idMatricula;
    private Long idConcepto;
    private String descripcionCuota;
    private BigDecimal montoTotal;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private String estadoDeuda;
    private LocalDateTime fechaPagoTotal;

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
}