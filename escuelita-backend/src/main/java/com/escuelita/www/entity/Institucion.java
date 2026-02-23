package com.escuelita.www.entity;

import java.time.LocalDate;

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
@Table(name = "institucion")
@SQLDelete(sql = "UPDATE institucion SET estado=0 WHERE id_institucion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_institucion", "nombre", "cod_modular", "tipo_gestion", 
    "resolucion_creacion", "nombre_director", "logo_path",
    "estado_suscripcion", "fecha_inicio_suscripcion", 
    "fecha_vencimiento_licencia", "plan_contratado", "estado"
})
public class Institucion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInstitucion;
    
    @Column(length = 150)
    private String nombre;
    
    @Column(length = 10)
    private String codModular;
    
    @Column(length = 50)
    private String tipoGestion;
    
    @Column(length = 50)
    private String resolucionCreacion;
    
    @Column(length = 100)
    private String nombreDirector;
    
    @Column(length = 255)
    private String logoPath;
    
    @Column(length = 50)
    private String estadoSuscripcion = "DEMO";
    
    private LocalDate fechaInicioSuscripcion;
    private LocalDate fechaVencimientoLicencia;
    
    @Column(length = 50)
    private String planContratado = "Plan Básico";
    
    private Integer estado = 1;

    //Constructor vacio
    public Institucion() {}
    public Institucion(Long idInstitucion) {
        this.idInstitucion = idInstitucion;
    }

    //Getters y Setters / ToString
    public Long getIdInstitucion() {
        return idInstitucion;
    }
    public void setIdInstitucion(Long idInstitucion) {
        this.idInstitucion = idInstitucion;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getCodModular() {
        return codModular;
    }
    public void setCodModular(String codModular) {
        this.codModular = codModular;
    }
    public String getTipoGestion() {
        return tipoGestion;
    }
    public void setTipoGestion(String tipoGestion) {
        this.tipoGestion = tipoGestion;
    }
    public String getResolucionCreacion() {
        return resolucionCreacion;
    }
    public void setResolucionCreacion(String resolucionCreacion) {
        this.resolucionCreacion = resolucionCreacion;
    }
    public String getNombreDirector() {
        return nombreDirector;
    }
    public void setNombreDirector(String nombreDirector) {
        this.nombreDirector = nombreDirector;
    }
    public String getLogoPath() {
        return logoPath;
    }
    public void setLogoPath(String logoPath) {
        this.logoPath = logoPath;
    }
    public String getEstadoSuscripcion() {
        return estadoSuscripcion;
    }
    public void setEstadoSuscripcion(String estadoSuscripcion) {
        this.estadoSuscripcion = estadoSuscripcion;
    }
    public LocalDate getFechaInicioSuscripcion() {
        return fechaInicioSuscripcion;
    }
    public void setFechaInicioSuscripcion(LocalDate fechaInicioSuscripcion) {
        this.fechaInicioSuscripcion = fechaInicioSuscripcion;
    }
    public LocalDate getFechaVencimientoLicencia() {
        return fechaVencimientoLicencia;
    }
    public void setFechaVencimientoLicencia(LocalDate fechaVencimientoLicencia) {
        this.fechaVencimientoLicencia = fechaVencimientoLicencia;
    }
    public String getPlanContratado() {
        return planContratado;
    }
    public void setPlanContratado(String planContratado) {
        this.planContratado = planContratado;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Institucion [idInstitucion=" + idInstitucion + ", nombre=" + nombre + ", codModular=" + codModular
                + ", tipoGestion=" + tipoGestion + ", resolucionCreacion=" + resolucionCreacion + ", nombreDirector="
                + nombreDirector + ", logoPath=" + logoPath + ", estadoSuscripcion=" + estadoSuscripcion
                + ", fechaInicioSuscripcion=" + fechaInicioSuscripcion + ", fechaVencimientoLicencia="
                + fechaVencimientoLicencia + ", planContratado=" + planContratado + ", estado=" + estado + "]";
    }
}