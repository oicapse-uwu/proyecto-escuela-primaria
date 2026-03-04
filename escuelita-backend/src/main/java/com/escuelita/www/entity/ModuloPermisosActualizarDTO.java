package com.escuelita.www.entity;

import java.util.List;

public class ModuloPermisosActualizarDTO {
    private Long idModulo;
    private List<Long> idPermisos;

    public ModuloPermisosActualizarDTO() {}

    public ModuloPermisosActualizarDTO(Long idModulo, List<Long> idPermisos) {
        this.idModulo = idModulo;
        this.idPermisos = idPermisos;
    }

    public Long getIdModulo() {
        return idModulo;
    }

    public void setIdModulo(Long idModulo) {
        this.idModulo = idModulo;
    }

    public List<Long> getIdPermisos() {
        return idPermisos;
    }

    public void setIdPermisos(List<Long> idPermisos) {
        this.idPermisos = idPermisos;
    }
}
