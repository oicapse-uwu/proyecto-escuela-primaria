package com.escuelita.www.entity;

public class ModuloAccesoDTO {
    private Long idModulo;
    private String nombre;
    private String descripcion;
    private String icono;
    private Integer orden;

    public ModuloAccesoDTO() {}

    public ModuloAccesoDTO(Long idModulo, String nombre, String descripcion, 
                          String icono, Integer orden) {
        this.idModulo = idModulo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.icono = icono;
        this.orden = orden;
    }

    public Long getIdModulo() {
        return idModulo;
    }

    public void setIdModulo(Long idModulo) {
        this.idModulo = idModulo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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
}
