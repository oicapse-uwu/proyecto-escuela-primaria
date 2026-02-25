package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "idDocente", "gradoAcademico", "fechaContratacion", "estadoLaboral", 
    "idUsuario", "idEspecialidad", "estado"
})
public class RolModuloPermisoDTO {

    private Long idRmp;

    private Long idRol;
    private Long idModulo;
    private Long idPermiso;

    private Integer estado = 1;

    public Long getIdRmp() {
        return idRmp;
    }
    public void setIdRmp(Long idRmp) {
        this.idRmp = idRmp;
    }
    public Long getIdRol() {
        return idRol;
    }
    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }
    public Long getIdModulo() {
        return idModulo;
    }
    public void setIdModulo(Long idModulo) {
        this.idModulo = idModulo;
    }
    public Long getIdPermiso() {
        return idPermiso;
    }
    public void setIdPermiso(Long idPermiso) {
        this.idPermiso = idPermiso;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "RolModuloPermisoDTO [idRmp=" + idRmp + ", idRol=" + idRol + ", idModulo=" + idModulo + ", idPermiso="
                + idPermiso + ", estado=" + estado + "]";
    }

    
}