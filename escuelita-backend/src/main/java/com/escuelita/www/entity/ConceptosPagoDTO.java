package com.escuelita.www.entity;

import java.math.BigDecimal;

public class ConceptosPagoDTO {
    
    private Long idConcepto;
    private Long idInstitucion;
    private Long idGrado;
    private String nombreConcepto;
    private BigDecimal monto;
    private Integer estadoConcepto;

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
}