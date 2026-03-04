//CORRECTO

package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

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
@Table(name = "suscripciones")
@SQLDelete(sql = "UPDATE suscripciones SET estado=0 WHERE id_suscripcion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idSuscripcion", "limiteAlumnosContratado", "limiteSedesContratadas", 
    "tipoDistribucionLimite", "precioAcordado", "fechaInicio", "fechaVencimiento",
    "idInstitucion", "idPlan", "idCiclo", "idEstado", "estado"
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
    @Column(name = "tipo_distribucion_limite", length = 20)
    private String tipoDistribucionLimite = "EQUITATIVA";
    @Column(name = "precio_acordado")
    private BigDecimal precioAcordado;
    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;
    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

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

    private Integer estado = 1;

    // Constructor vacio
    public Suscripciones() {
    }
    public Suscripciones(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

    // Getters y Setters / toString
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
    public String getTipoDistribucionLimite() {
        return tipoDistribucionLimite;
    }
    public void setTipoDistribucionLimite(String tipoDistribucionLimite) {
        this.tipoDistribucionLimite = tipoDistribucionLimite;
    }
    public BigDecimal getPrecioAcordado() {
        return precioAcordado;
    }
    public void setPrecioAcordado(BigDecimal precioAcordado) {
        this.precioAcordado = precioAcordado;
    }
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    public EstadosSuscripcion getIdEstado() {
        return idEstado;
    }
    public void setIdEstado(EstadosSuscripcion idEstado) {
        this.idEstado = idEstado;
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
        public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Suscripciones [idSuscripcion=" + idSuscripcion + ", limiteAlumnosContratado=" + limiteAlumnosContratado
                + ", limiteSedesContratadas=" + limiteSedesContratadas 
                + ", tipoDistribucionLimite=" + tipoDistribucionLimite
                + ", precioAcordado=" + precioAcordado
                + ", fechaInicio=" + fechaInicio + ", fechaVencimiento=" + fechaVencimiento 
                + ", idInstitucion=" + idInstitucion + ", idPlan=" + idPlan + ", idCiclo=" 
                + idCiclo + ", idEstado=" + idEstado + ", estado=" + estado + "]";
    }
}