package com.escuelita.www.entity;

import java.util.List;

/**
 * DTO para asignar/obtener módulos de un rol
 * Arquitectura simplificada: solo módulos, sin permisos granulares
 */
public class RolModulosDTO {
    private Long idRol;
    private List<Long> modulosAsignados;  // Lista de IDs de módulos

    public RolModulosDTO() {}

    public RolModulosDTO(Long idRol, List<Long> modulosAsignados) {
        this.idRol = idRol;
        this.modulosAsignados = modulosAsignados;
    }

    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }

    public List<Long> getModulosAsignados() {
        return modulosAsignados;
    }

    public void setModulosAsignados(List<Long> modulosAsignados) {
        this.modulosAsignados = modulosAsignados;
    }

    @Override
    public String toString() {
        return "RolModulosDTO{" +
                "idRol=" + idRol +
                ", modulosAsignados=" + modulosAsignados +
                '}';
    }
}
