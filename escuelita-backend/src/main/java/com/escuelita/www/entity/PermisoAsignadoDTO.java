package com.escuelita.www.entity;

public class PermisoAsignadoDTO {
    private Long idPermiso;
    private String nombre;
    private String codigo;
    private String descripcion;
    private Boolean asignado;

    public PermisoAsignadoDTO() {}

    public PermisoAsignadoDTO(Long idPermiso, String nombre, String codigo, 
                             String descripcion, Boolean asignado) {
        this.idPermiso = idPermiso;
        this.nombre = nombre;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.asignado = asignado;
    }

    public Long getIdPermiso() {
        return idPermiso;
    }

    public void setIdPermiso(Long idPermiso) {
        this.idPermiso = idPermiso;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getAsignado() {
        return asignado;
    }

    public void setAsignado(Boolean asignado) {
        this.asignado = asignado;
    }
}
