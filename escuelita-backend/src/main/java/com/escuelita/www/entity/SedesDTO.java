package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idSede", "nombreSede", "codigoEstablecimiento", "esSedePrincipal",
    "direccion", "distrito", "provincia", "departamento", "ugel", 
    "telefono", "correoInstitucional", "idInstitucion", "estado"
})

public class SedesDTO {

    private Long idSede;
    private String nombreSede;
    private String codigoEstablecimiento = "0000";
    private Boolean esSedePrincipal = false;
    private String direccion;
    private String distrito;
    private String provincia;
    private String departamento;
    private String ugel;
    private String telefono;
    private String correoInstitucional;

    private Long idInstitucion;
    
    private Integer estado = 1;

    public Long getIdSede() {
        return idSede;
    }
    public void setIdSede(Long idSede) {
        this.idSede = idSede;
    }
    public String getNombreSede() {
        return nombreSede;
    }
    public void setNombreSede(String nombreSede) {
        this.nombreSede = nombreSede;
    }
    public String getCodigoEstablecimiento() {
        return codigoEstablecimiento;
    }
    public void setCodigoEstablecimiento(String codigoEstablecimiento) {
        this.codigoEstablecimiento = codigoEstablecimiento;
    }
    public Boolean getEsSedePrincipal() {
        return esSedePrincipal;
    }
    public void setEsSedePrincipal(Boolean esSedePrincipal) {
        this.esSedePrincipal = esSedePrincipal;
    }
    public String getDireccion() {
        return direccion;
    }
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    public String getDistrito() {
        return distrito;
    }
    public void setDistrito(String distrito) {
        this.distrito = distrito;
    }
    public String getProvincia() {
        return provincia;
    }
    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }
    public String getDepartamento() {
        return departamento;
    }
    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }
    public String getUgel() {
        return ugel;
    }
    public void setUgel(String ugel) {
        this.ugel = ugel;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public String getCorreoInstitucional() {
        return correoInstitucional;
    }
    public void setCorreoInstitucional(String correoInstitucional) {
        this.correoInstitucional = correoInstitucional;
    }
    public Long getIdInstitucion() {
        return idInstitucion;
    }
    public void setIdInstitucion(Long idInstitucion) {
        this.idInstitucion = idInstitucion;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "SedesDTO [idSede=" + idSede + ", nombreSede=" + nombreSede + ", codigoEstablecimiento=" 
                + codigoEstablecimiento + ", esSedePrincipal=" + esSedePrincipal + ", direccion=" + direccion 
                + ", distrito=" + distrito + ", provincia=" + provincia + ", departamento=" + departamento 
                + ", ugel=" + ugel + ", telefono=" + telefono + ", correoInstitucional=" + correoInstitucional 
                + ", idInstitucion=" + idInstitucion + ", estado=" + estado + "]";
    }
}