package com.escuelita.www.entity;

import java.util.List;

public class MatrizRolDTO {
    private Long idRol;
    private String nombreRol;
    private List<MatrizModuloDTO> modulos;

    public MatrizRolDTO() {}

    public MatrizRolDTO(Long idRol, String nombreRol, List<MatrizModuloDTO> modulos) {
        this.idRol = idRol;
        this.nombreRol = nombreRol;
        this.modulos = modulos;
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

    public List<MatrizModuloDTO> getModulos() {
        return modulos;
    }

    public void setModulos(List<MatrizModuloDTO> modulos) {
        this.modulos = modulos;
    }
}
