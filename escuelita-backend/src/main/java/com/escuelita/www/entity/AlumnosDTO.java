package com.escuelita.www.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idAlumno", "numeroDocumento", "nombres", "apellidos", 
    "fechaNacimiento", "genero", "direccion", "telefonoContacto", 
    "fotoUrl", "observacionesSalud", "tipoIngreso", "estadoAlumno",
    "idSede", "idTipoDoc", "estado"
})
public class AlumnosDTO {

    private Long idAlumno;
    private String numeroDocumento;
    private String nombres;
    private String apellidos;
    private LocalDate fechaNacimiento;
    private String genero;
    private String direccion;
    private String telefonoContacto;
    private String fotoUrl;
    private String observacionesSalud;
    private String tipoIngreso;
    private String estadoAlumno;

    private Long idSede;
    private Long idTipoDoc;

    private Integer estado = 1;

    public Long getIdAlumno() {
        return idAlumno;
    }
    public void setIdAlumno(Long idAlumno) {
        this.idAlumno = idAlumno;
    }
    public String getNumeroDocumento() {
        return numeroDocumento;
    }
    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }
    public String getNombres() {
        return nombres;
    }
    public void setNombres(String nombres) {
        this.nombres = nombres;
    }
    public String getApellidos() {
        return apellidos;
    }
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    public String getGenero() {
        return genero;
    }
    public void setGenero(String genero) {
        this.genero = genero;
    }
    public String getDireccion() {
        return direccion;
    }
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    public String getTelefonoContacto() {
        return telefonoContacto;
    }
    public void setTelefonoContacto(String telefonoContacto) {
        this.telefonoContacto = telefonoContacto;
    }
    public String getFotoUrl() {
        return fotoUrl;
    }
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
    public String getObservacionesSalud() {
        return observacionesSalud;
    }
    public void setObservacionesSalud(String observacionesSalud) {
        this.observacionesSalud = observacionesSalud;
    }
    public String getTipoIngreso() {
        return tipoIngreso;
    }
    public void setTipoIngreso(String tipoIngreso) {
        this.tipoIngreso = tipoIngreso;
    }
    public String getEstadoAlumno() {
        return estadoAlumno;
    }
    public void setEstadoAlumno(String estadoAlumno) {
        this.estadoAlumno = estadoAlumno;
    }
    public Long getIdSede() {
        return idSede;
    }
    public void setIdSede(Long idSede) {
        this.idSede = idSede;
    }
    public Long getIdTipoDoc() {
        return idTipoDoc;
    }
    public void setIdTipoDoc(Long idTipoDoc) {
        this.idTipoDoc = idTipoDoc;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "AlumnosDTO [idAlumno=" + idAlumno + ", numeroDocumento=" + numeroDocumento + ", nombres=" + nombres
                + ", apellidos=" + apellidos + ", fechaNacimiento=" + fechaNacimiento + ", genero=" + genero
                + ", direccion=" + direccion + ", telefonoContacto=" + telefonoContacto + ", fotoUrl=" + fotoUrl
                + ", observacionesSalud=" + observacionesSalud + ", tipoIngreso=" + tipoIngreso + ", estadoAlumno="
                + estadoAlumno + ", idSede=" + idSede + ", idTipoDoc=" + idTipoDoc + ", estado=" + estado + "]";
    }
}