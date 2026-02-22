package com.escuelita.www.entity;

import java.time.LocalDate;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

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
    "idInstitucion", "nombre", "codModular", "tipoGestion", "resolucionCreacion", 
    "nombreDirector", "logoPath", "estadoSuscripcion", "fechaInicioSuscripcion", 
    "fechaVencimientoLicencia", "planContratado", "estado"
})
public class Institucion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInstitucion;
    
    private String nombre;
    private String codModular;
    private String tipoGestion;
    private String resolucionCreacion;
    private String nombreDirector;
    private String logoPath;
    private String estadoSuscripcion = "DEMO";
    private LocalDate fechaInicioSuscripcion;
    private LocalDate fechaVencimientoLicencia;
    private String planContratado = "Plan Básico";
    private Integer estado = 1;

    //Constructor vacio
    public Institucion() {}
    public Institucion(Long id_institucion) {
        this.idInstitucion = id_institucion;
    }

    public Long getIdInstitucion() { return idInstitucion; }
    public void setIdInstitucion(Long idInstitucion) { this.idInstitucion = idInstitucion; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodModular() { return codModular; }
    public void setCodModular(String codModular) { this.codModular = codModular; }

    public String getTipoGestion() { return tipoGestion; }
    public void setTipoGestion(String tipoGestion) { this.tipoGestion = tipoGestion; }

    public String getResolucionCreacion() { return resolucionCreacion; }
    public void setResolucionCreacion(String resolucionCreacion) { this.resolucionCreacion = resolucionCreacion; }

    public String getNombreDirector() { return nombreDirector; }
    public void setNombreDirector(String nombreDirector) { this.nombreDirector = nombreDirector; }

    public String getLogoPath() { return logoPath; }
    public void setLogoPath(String logoPath) { this.logoPath = logoPath; }

    public String getEstadoSuscripcion() { return estadoSuscripcion; }
    public void setEstadoSuscripcion(String estadoSuscripcion) { this.estadoSuscripcion = estadoSuscripcion; }

    public LocalDate getFechaInicioSuscripcion() { return fechaInicioSuscripcion; }
    public void setFechaInicioSuscripcion(LocalDate fechaInicioSuscripcion) { this.fechaInicioSuscripcion = fechaInicioSuscripcion; }

    public LocalDate getFechaVencimientoLicencia() { return fechaVencimientoLicencia; }
    public void setFechaVencimientoLicencia(LocalDate fechaVencimientoLicencia) { this.fechaVencimientoLicencia = fechaVencimientoLicencia; }

    public String getPlanContratado() { return planContratado; }
    public void setPlanContratado(String planContratado) { this.planContratado = planContratado; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }
}