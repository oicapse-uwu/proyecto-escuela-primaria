package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idApoderado", "numeroDocumento", "nombres", "apellidos", 
    "telefonoPrincipal", "correo", "lugarTrabajo",
    "idSede", "idTipoDoc", "estado"
})
public class ApoderadosDTO {

    private Long idApoderado;    
    private String numeroDocumento;
    private String nombres;
    private String apellidos;
    private String telefonoPrincipal;
    private String correo;
    private String lugarTrabajo;

    private Long idSede;
    private Long idTipoDoc;

    private Integer estado = 1;

    public Long getIdApoderado() {
        return idApoderado;
    }
    public void setIdApoderado(Long idApoderado) {
        this.idApoderado = idApoderado;
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
    public String getTelefonoPrincipal() {
        return telefonoPrincipal;
    }
    public void setTelefonoPrincipal(String telefonoPrincipal) {
        this.telefonoPrincipal = telefonoPrincipal;
    }
    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    public String getLugarTrabajo() {
        return lugarTrabajo;
    }
    public void setLugarTrabajo(String lugarTrabajo) {
        this.lugarTrabajo = lugarTrabajo;
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
        return "ApoderadosDTO [idApoderado=" + idApoderado + ", numeroDocumento=" + numeroDocumento + ", nombres="
                + nombres + ", apellidos=" + apellidos + ", telefonoPrincipal=" + telefonoPrincipal + ", correo="
                + correo + ", lugarTrabajo=" + lugarTrabajo + ", idSede=" + idSede + ", idTipoDoc=" + idTipoDoc
                + ", estado=" + estado + "]";
    }
}