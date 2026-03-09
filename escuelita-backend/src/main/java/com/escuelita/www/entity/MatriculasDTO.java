package com.escuelita.www.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idMatricula", "codigoMatricula", "fechaMatricula", "fechaVencimientoPago",
    "tipoIngreso", "estadoMatricula", "vacanteGarantizada", "fechaPagoMatricula",
    "observaciones", "idAlumno", "idSeccion", "idAnio", "estado"
})
public class MatriculasDTO {

    private Long idMatricula;
    private String codigoMatricula;
    private LocalDateTime fechaMatricula;
    private LocalDateTime fechaVencimientoPago;
    private String tipoIngreso;
    private String estadoMatricula;
    private Boolean vacanteGarantizada;
    private LocalDateTime fechaPagoMatricula;
    private String observaciones;

    private Long idAlumno;
    private Long idSeccion;
    private Long idAnio;

    private Integer estado = 1;

    public Long getIdMatricula() {
        return idMatricula;
    }
    public void setIdMatricula(Long idMatricula) {
        this.idMatricula = idMatricula;
    }
    public String getCodigoMatricula() {
        return codigoMatricula;
    }
    public void setCodigoMatricula(String codigoMatricula) {
        this.codigoMatricula = codigoMatricula;
    }
    public LocalDateTime getFechaMatricula() {
        return fechaMatricula;
    }
    public void setFechaMatricula(LocalDateTime fechaMatricula) {
        this.fechaMatricula = fechaMatricula;
    }
    public LocalDateTime getFechaVencimientoPago() {
        return fechaVencimientoPago;
    }
    public void setFechaVencimientoPago(LocalDateTime fechaVencimientoPago) {
        this.fechaVencimientoPago = fechaVencimientoPago;
    }
    public String getTipoIngreso() {
        return tipoIngreso;
    }
    public void setTipoIngreso(String tipoIngreso) {
        this.tipoIngreso = tipoIngreso;
    }
    public String getEstadoMatricula() {
        return estadoMatricula;
    }
    public void setEstadoMatricula(String estadoMatricula) {
        this.estadoMatricula = estadoMatricula;
    }
    public Boolean getVacanteGarantizada() {
        return vacanteGarantizada;
    }
    public void setVacanteGarantizada(Boolean vacanteGarantizada) {
        this.vacanteGarantizada = vacanteGarantizada;
    }
    public LocalDateTime getFechaPagoMatricula() {
        return fechaPagoMatricula;
    }
    public void setFechaPagoMatricula(LocalDateTime fechaPagoMatricula) {
        this.fechaPagoMatricula = fechaPagoMatricula;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public Long getIdAlumno() {
        return idAlumno;
    }
    public void setIdAlumno(Long idAlumno) {
        this.idAlumno = idAlumno;
    }
    public Long getIdSeccion() {
        return idSeccion;
    }
    public void setIdSeccion(Long idSeccion) {
        this.idSeccion = idSeccion;
    }
    public Long getIdAnio() {
        return idAnio;
    }
    public void setIdAnio(Long idAnio) {
        this.idAnio = idAnio;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "MatriculasDTO [idMatricula=" + idMatricula + ", codigoMatricula=" + codigoMatricula 
                + ", fechaMatricula=" + fechaMatricula + ", fechaVencimientoPago=" + fechaVencimientoPago
                + ", tipoIngreso=" + tipoIngreso + ", estadoMatricula=" + estadoMatricula 
                + ", vacanteGarantizada=" + vacanteGarantizada + ", fechaPagoMatricula=" + fechaPagoMatricula
                + ", observaciones=" + observaciones + ", idAlumno=" + idAlumno + ", idSeccion=" + idSeccion 
                + ", idAnio=" + idAnio + ", estado=" + estado + "]";
    }
}