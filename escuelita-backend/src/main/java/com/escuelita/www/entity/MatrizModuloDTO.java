package com.escuelita.www.entity;

import java.util.List;

public class MatrizModuloDTO {
    private Long idModulo;
    private String nombreModulo;
    private String descripcion;
    private String icono;
    private Integer orden;
    private List<PermisoAsignadoDTO> permisos;

    public MatrizModuloDTO() {}

    public MatrizModuloDTO(Long idModulo, String nombreModulo, String descripcion, 
                          String icono, Integer orden, List<PermisoAsignadoDTO> permisos) {
        this.idModulo = idModulo;
        this.nombreModulo = nombreModulo;
        this.descripcion = descripcion;
        this.icono = icono;
        this.orden = orden;
        this.permisos = permisos;
    }

    public Long getIdModulo() {
        return idModulo;
    }

    public void setIdModulo(Long idModulo) {
        this.idModulo = idModulo;
    }

    public String getNombreModulo() {
        return nombreModulo;
    }

    public void setNombreModulo(String nombreModulo) {
        this.nombreModulo = nombreModulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    public List<PermisoAsignadoDTO> getPermisos() {
        return permisos;
    }

    public void setPermisos(List<PermisoAsignadoDTO> permisos) {
        this.permisos = permisos;
    }
}
