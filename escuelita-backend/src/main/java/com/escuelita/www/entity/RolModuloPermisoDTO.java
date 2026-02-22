package com.escuelita.www.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "rol_modulo_permiso")
@SQLDelete(sql = "UPDATE rol_modulo_permiso SET estado=0 WHERE id_rmp=?")
@SQLRestriction("estado = 1")
public class RolModuloPermisoDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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