package com.escuelita.www.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idMovimiento", "tipoMovimiento", "fechaMovimiento", "fechaSolicitud",
    "motivo", "colegioDestino", "documentosUrl", "observaciones",
    "idUsuarioRegistro", "idUsuarioAprobador", "fechaAprobacion",
    "estadoSolicitud", "idMatricula", "estado"
})
public class MovimientosAlumnoDTO {

    private Long idMovimiento;
    private String tipoMovimiento;
    private LocalDate fechaMovimiento;
    private LocalDateTime fechaSolicitud;
    private String motivo;
    private String colegioDestino;
    private String documentosUrl;
    private String observaciones;
    private Long idUsuarioRegistro;
    private Long idUsuarioAprobador;
    private LocalDateTime fechaAprobacion;
    private String estadoSolicitud;
    private Long idMatricula;
    private Integer estado = 1;

    //Getters y Setters
    public Long getIdMovimiento() {
        return idMovimiento;
    }
    public void setIdMovimiento(Long idMovimiento) {
        this.idMovimiento = idMovimiento;
    }
    public String getTipoMovimiento() {
        return tipoMovimiento;
    }
    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }
    public LocalDate getFechaMovimiento() {
        return fechaMovimiento;
    }
    public void setFechaMovimiento(LocalDate fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
    }
    public LocalDateTime getFechaSolicitud() {
        return fechaSolicitud;
    }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }
    public String getMotivo() {
        return motivo;
    }
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
    public String getColegioDestino() {
        return colegioDestino;
    }
    public void setColegioDestino(String colegioDestino) {
        this.colegioDestino = colegioDestino;
    }
    public String getDocumentosUrl() {
        return documentosUrl;
    }
    public void setDocumentosUrl(String documentosUrl) {
        this.documentosUrl = documentosUrl;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public Long getIdUsuarioRegistro() {
        return idUsuarioRegistro;
    }
    public void setIdUsuarioRegistro(Long idUsuarioRegistro) {
        this.idUsuarioRegistro = idUsuarioRegistro;
    }
    public Long getIdUsuarioAprobador() {
        return idUsuarioAprobador;
    }
    public void setIdUsuarioAprobador(Long idUsuarioAprobador) {
        this.idUsuarioAprobador = idUsuarioAprobador;
    }
    public LocalDateTime getFechaAprobacion() {
        return fechaAprobacion;
    }
    public void setFechaAprobacion(LocalDateTime fechaAprobacion) {
        this.fechaAprobacion = fechaAprobacion;
    }
    public String getEstadoSolicitud() {
        return estadoSolicitud;
    }
    public void setEstadoSolicitud(String estadoSolicitud) {
        this.estadoSolicitud = estadoSolicitud;
    }
    public Long getIdMatricula() {
        return idMatricula;
    }
    public void setIdMatricula(Long idMatricula) {
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
        return "MovimientosAlumnoDTO [idMovimiento=" + idMovimiento + ", tipoMovimiento=" + tipoMovimiento
                + ", fechaMovimiento=" + fechaMovimiento + ", fechaSolicitud=" + fechaSolicitud
                + ", motivo=" + motivo + ", colegioDestino=" + colegioDestino + ", documentosUrl=" + documentosUrl
                + ", observaciones=" + observaciones + ", idUsuarioRegistro=" + idUsuarioRegistro
                + ", idUsuarioAprobador=" + idUsuarioAprobador + ", fechaAprobacion=" + fechaAprobacion
                + ", estadoSolicitud=" + estadoSolicitud + ", idMatricula=" + idMatricula + ", estado=" + estado + "]";
    }
}
