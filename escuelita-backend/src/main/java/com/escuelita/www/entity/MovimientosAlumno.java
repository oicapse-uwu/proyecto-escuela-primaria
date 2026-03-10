//CORRECTO
package com.escuelita.www.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
@Table(name = "movimientos_alumno")
@SQLDelete(sql = "UPDATE movimientos_alumno SET estado=0 WHERE id_movimiento=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idMovimiento", "tipoMovimiento", "fechaMovimiento", "fechaSolicitud",
    "motivo", "colegioDestino", "documentosUrl", "observaciones",
    "idUsuarioRegistro", "idUsuarioAprobador", "fechaAprobacion",
    "estadoSolicitud", "idMatricula", "estado"
})
public class MovimientosAlumno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Long idMovimiento;
    
    @Column(name = "tipo_movimiento",
            columnDefinition = "ENUM('Retiro', 'Traslado_Saliente', 'Cambio_Seccion')", nullable = false)
    private String tipoMovimiento;
    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDate fechaMovimiento;
    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud;
    @Column(name = "motivo", columnDefinition = "TEXT", nullable = false)
    private String motivo;
    @Column(name = "colegio_destino", length = 200)
    private String colegioDestino;
    @Column(name = "documentos_url", length = 255)
    private String documentosUrl;
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
    @Column(name = "id_usuario_registro")
    private Long idUsuarioRegistro;
    @Column(name = "id_usuario_aprobador")
    private Long idUsuarioAprobador;
    @Column(name = "fecha_aprobacion")
    private LocalDateTime fechaAprobacion;
    @Column(name = "estado_solicitud",
            columnDefinition = "ENUM('Pendiente', 'Aprobada', 'Rechazada')")
    private String estadoSolicitud = "Pendiente";
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_matricula")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Matriculas idMatricula;

    private Integer estado = 1;

    //Constructores
    public MovimientosAlumno() {}
    
    public MovimientosAlumno(Long idMovimiento) {
        this.idMovimiento = idMovimiento;
    }

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
        return "MovimientosAlumno [idMovimiento=" + idMovimiento + ", tipoMovimiento=" + tipoMovimiento 
                + ", fechaMovimiento=" + fechaMovimiento + ", fechaSolicitud=" + fechaSolicitud 
                + ", motivo=" + motivo + ", colegioDestino=" + colegioDestino + ", documentosUrl=" + documentosUrl 
                + ", observaciones=" + observaciones + ", idUsuarioRegistro=" + idUsuarioRegistro 
                + ", idUsuarioAprobador=" + idUsuarioAprobador + ", fechaAprobacion=" + fechaAprobacion 
                + ", estadoSolicitud=" + estadoSolicitud + ", idMatricula=" + idMatricula + ", estado=" + estado + "]";
    }
}
