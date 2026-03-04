package com.escuelita.www.entity;

public class PermisoAccesoDTO {
    private Long idPermiso;
    private String nombre;
    private String codigo;
    private String descripcion;

    public PermisoAccesoDTO() {}

    public PermisoAccesoDTO(Long idPermiso, String nombre, String codigo, String descripcion) {
        this.idPermiso = idPermiso;
        this.nombre = nombre;
        this.codigo = codigo;
        this.descripcion = descripcion;
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
}
