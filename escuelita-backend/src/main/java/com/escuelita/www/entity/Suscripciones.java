package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.util.Date;

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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "suscripciones")
@SQLDelete(sql = "UPDATE suscripciones SET estado=0 WHERE id_suscripcion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idSuscripcion", "idInstitucion", "idPlan", "idCiclo", "idEstado",
    "limiteAlumnosContratado", "limiteSedesContratadas", "precioAcordado",
    "fechaInicio", "fechaVencimiento", "estado"
})
public class Suscripciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_suscripcion")
    private Long idSuscripcion;

    @Column(name = "limite_alumnos_contratado")
    private Integer limiteAlumnosContratado;

    @Column(name = "limite_sedes_contratadas")
    private Integer limiteSedesContratadas;

    @Column(name = "precio_acordado")
    private BigDecimal precioAcordado;

    @Column(name = "fecha_inicio")
    @Temporal(TemporalType.DATE)
    private Date fechaInicio;

    @Column(name = "fecha_vencimiento")
    @Temporal(TemporalType.DATE)
    private Date fechaVencimiento;

    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_institucion")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Institucion idInstitucion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_plan")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Planes idPlan;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ciclo")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CiclosFacturacion idCiclo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private EstadosSuscripcion idEstado;

    public Long getIdSuscripcion() {
        return idSuscripcion;
    }
    public void setIdSuscripcion(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }
    public Integer getLimiteAlumnosContratado() {
        return limiteAlumnosContratado;
    }
    public void setLimiteAlumnosContratado(Integer limiteAlumnosContratado) {
        this.limiteAlumnosContratado = limiteAlumnosContratado;
    }
    public Integer getLimiteSedesContratadas() {
        return limiteSedesContratadas;
    }
    public void setLimiteSedesContratadas(Integer limiteSedesContratadas) {
        this.limiteSedesContratadas = limiteSedesContratadas;
    }
    public BigDecimal getPrecioAcordado() {
        return precioAcordado;
    }
    public void setPrecioAcordado(BigDecimal precioAcordado) {
        this.precioAcordado = precioAcordado;
    }
    public Date getFechaInicio() {
        return fechaInicio;
    }
    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    public Date getFechaVencimiento() {
        return fechaVencimiento;
    }
    public void setFechaVencimiento(Date fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    public Institucion getIdInstitucion() {
        return idInstitucion;
    }
    public void setIdInstitucion(Institucion idInstitucion) {
        this.idInstitucion = idInstitucion;
    }
    public Planes getIdPlan() {
        return idPlan;
    }
    public void setIdPlan(Planes idPlan) {
        this.idPlan = idPlan;
    }
    public CiclosFacturacion getIdCiclo() {
        return idCiclo;
    }
    public void setIdCiclo(CiclosFacturacion idCiclo) {
        this.idCiclo = idCiclo;
    }
    public EstadosSuscripcion getIdEstado() {
        return idEstado;
    }
    public void setIdEstado(EstadosSuscripcion idEstado) {
        this.idEstado = idEstado;
    }
    @Override
    public String toString() {
        return "Suscripciones [idSuscripcion=" + idSuscripcion + ", limiteAlumnosContratado=" + limiteAlumnosContratado
                + ", limiteSedesContratadas=" + limiteSedesContratadas + ", precioAcordado=" + precioAcordado
                + ", fechaInicio=" + fechaInicio + ", fechaVencimiento=" + fechaVencimiento + ", estado=" + estado
                + ", idInstitucion=" + idInstitucion + ", idPlan=" + idPlan + ", idCiclo=" + idCiclo + ", idEstado="
                + idEstado + "]";
    }
}