//CORRECTO

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
    "idInstitucion", "nombre", "ruc", "razonSocial", "domicilioFiscal", 
    "codModular", "tipoGestion", "resolucionCreacion", "nombreDirector", 
    "representanteLegal", "correoFacturacion", "telefonoFacturacion", "logoPath",
    "estadoSuscripcion", "fechaInicioSuscripcion", 
    "fechaVencimientoLicencia", "planContratado", "estado"
})
public class Institucion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_institucion")
    private Long idInstitucion;

    @Column(length = 150)
    private String nombre;
    @Column(length = 11, unique = true)
    private String ruc;
    @Column(name = "razon_social", length = 200)
    private String razonSocial;
    @Column(name = "domicilio_fiscal", length = 255)
    private String domicilioFiscal;
    @Column(name = "cod_modular", length = 10)
    private String codModular;
    @Column(name = "tipo_gestion", length = 50)
    private String tipoGestion;
    @Column(name = "resolucion_creacion", length = 50)
    private String resolucionCreacion;
    @Column(name = "nombre_director", length = 100)
    private String nombreDirector;
    @Column(name = "representante_legal", length = 150)
    private String representanteLegal;
    @Column(name = "correo_facturacion", length = 100)
    private String correoFacturacion;
    @Column(name = "telefono_facturacion", length = 20)
    private String telefonoFacturacion;
    @Column(name = "logo_path", length = 255)
    private String logoPath;
    @Column(name = "estado_suscripcion", length = 50)
    private String estadoSuscripcion = "DEMO";
    @Column(name = "fecha_inicio_suscripcion")
    private LocalDate fechaInicioSuscripcion;
    @Column(name = "fecha_vencimiento_licencia")
    private LocalDate fechaVencimientoLicencia;
    @Column(name = "plan_contratado", length = 50)
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
    public String getRuc() {
        return ruc;
    }
    public void setRuc(String ruc) {
        this.ruc = ruc;
    }
    public String getRazonSocial() {
        return razonSocial;
    }
    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }
    public String getDomicilioFiscal() {
        return domicilioFiscal;
    }
    public void setDomicilioFiscal(String domicilioFiscal) {
        this.domicilioFiscal = domicilioFiscal;
    }
    public String getCodModular() {
        return codModular;
    }
    public void setCodModular(String codModular) {
        this.codModular = codModular;
    }
    public String getRepresentanteLegal() {
        return representanteLegal;
    }
    public void setRepresentanteLegal(String representanteLegal) {
        this.representanteLegal = representanteLegal;
    }
    public String getCorreoFacturacion() {
        return correoFacturacion;
    }
    public void setCorreoFacturacion(String correoFacturacion) {
        this.correoFacturacion = correoFacturacion;
    }
    public String getTelefonoFacturacion() {
        return telefonoFacturacion;
    }
    public void setTelefonoFacturacion(String telefonoFacturacion) {
        this.telefonoFacturacion = telefonoFacturacion;
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
        return "Institucion [idInstitucion=" + idInstitucion + ", nombre=" + nombre + ", ruc=" + ruc + ", razonSocial="
                + razonSocial + ", domicilioFiscal=" + domicilioFiscal + ", codModular=" + codModular + ", tipoGestion="
                + tipoGestion + ", resolucionCreacion=" + resolucionCreacion + ", nombreDirector=" + nombreDirector
                + ", representanteLegal=" + representanteLegal + ", correoFacturacion=" + correoFacturacion
                + ", telefonoFacturacion=" + telefonoFacturacion + ", logoPath=" + logoPath + ", estadoSuscripcion="
                + estadoSuscripcion + ", fechaInicioSuscripcion=" + fechaInicioSuscripcion
                + ", fechaVencimientoLicencia=" + fechaVencimientoLicencia + ", planContratado=" + planContratado
                + ", estado=" + estado + "]";
    }
}