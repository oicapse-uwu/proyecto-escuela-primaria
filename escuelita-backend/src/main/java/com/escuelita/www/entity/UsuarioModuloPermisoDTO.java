package com.escuelita.www.entity;

public class UsuarioModuloPermisoDTO {
    private Long idUmp;
    private Long idUsuario;
    private Long idModulo;
    private Long idPermiso;

    public UsuarioModuloPermisoDTO() {
    }

    public UsuarioModuloPermisoDTO(Long idUmp, Long idUsuario, Long idModulo, Long idPermiso) {
        this.idUmp = idUmp;
        this.idUsuario = idUsuario;
        this.idModulo = idModulo;
        this.idPermiso = idPermiso;
    }

    public Long getIdUmp() {
        return idUmp;
    }

    public void setIdUmp(Long idUmp) {
        this.idUmp = idUmp;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
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
}
