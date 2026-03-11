package com.escuelita.www.entity;

public class UsuarioEscuelaDTO {
    private Long idUsuario;
    private String nombres;
    private String apellidos;
    private String correo;
    private String usuario;
    private String fotoPerfil;
    private RolDTO rol;
    private SedeDTO sede;

    // Constructor vacío
    public UsuarioEscuelaDTO() {
    }

    // Getters y Setters
    public Long getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
    public String getNombres() {
        return nombres;
    }
    public void setNombres(String nombres) {
        this.nombres = nombres;
    }
    public String getApellidos() {
        return apellidos;
    }
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    public String getUsuario() {
        return usuario;
    }
    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }
    public String getFotoPerfil() {
        return fotoPerfil;
    }
    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }
    public RolDTO getRol() {
        return rol;
    }
    public void setRol(RolDTO rol) {
        this.rol = rol;
    }
    public SedeDTO getSede() {
        return sede;
    }
    public void setSede(SedeDTO sede) {
        this.sede = sede;
    }

    // Clase interna para el rol
    public static class RolDTO {
        private Long idRol;
        private String nombreRol;

        public RolDTO() {
        }
        public RolDTO(Long idRol, String nombreRol) {
            this.idRol = idRol;
            this.nombreRol = nombreRol;
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
    }

    // Clase interna para la sede
    public static class SedeDTO {
        private Long idSede;
        private String nombreSede;
        private Long idInstitucion;

        public SedeDTO() {
        }
        public SedeDTO(Long idSede, String nombreSede) {
            this.idSede = idSede;
            this.nombreSede = nombreSede;
        }
        public Long getIdSede() {
            return idSede;
        }
        public void setIdSede(Long idSede) {
            this.idSede = idSede;
        }
        public String getNombreSede() {
            return nombreSede;
        }
        public void setNombreSede(String nombreSede) {
            this.nombreSede = nombreSede;
        }
        public Long getIdInstitucion() {
            return idInstitucion;
        }
        public void setIdInstitucion(Long idInstitucion) {
            this.idInstitucion = idInstitucion;
        }
    }
}
