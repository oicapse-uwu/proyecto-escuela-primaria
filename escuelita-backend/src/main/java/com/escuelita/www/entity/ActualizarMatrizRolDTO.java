package com.escuelita.www.entity;

import java.util.List;

public class ActualizarMatrizRolDTO {
    private Long idRol;
    private List<ModuloPermisosActualizarDTO> modulos;

    public ActualizarMatrizRolDTO() {}

    public ActualizarMatrizRolDTO(Long idRol, List<ModuloPermisosActualizarDTO> modulos) {
        this.idRol = idRol;
        this.modulos = modulos;
    }

    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }

    public List<ModuloPermisosActualizarDTO> getModulos() {
        return modulos;
    }

    public void setModulos(List<ModuloPermisosActualizarDTO> modulos) {
        this.modulos = modulos;
    }
}
