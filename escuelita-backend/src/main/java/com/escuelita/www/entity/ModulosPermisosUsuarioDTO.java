package com.escuelita.www.entity;

import java.util.List;

public class ModulosPermisosUsuarioDTO {
    private Long idUsuario;
    private String nombreUsuario;
    private Long idRol;
    private String nombreRol;
    private List<ModuloAccesoDTO> modulos;

    public ModulosPermisosUsuarioDTO() {}

    public ModulosPermisosUsuarioDTO(Long idUsuario, String nombreUsuario, Long idRol, 
                                     String nombreRol, List<ModuloAccesoDTO> modulos) {
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.idRol = idRol;
        this.nombreRol = nombreRol;
        this.modulos = modulos;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }

    public String getNombreRol() {
        return nombreRol;
    }

    public void setNombreRol(String nombreRol) {
        this.nombreRol = nombreRol;
    }

    public List<ModuloAccesoDTO> getModulos() {
        return modulos;
    }

    public void setModulos(List<ModuloAccesoDTO> modulos) {
        this.modulos = modulos;
    }
}
