package com.escuelita.www.entity;

public class SuperAdminDTO {
    private Long idUsuario;
    private String nombres;
    private String apellidos;
    private String correo;
    private String usuario;
    private String fotoUrl;
    private RolDTO rol;

    // Constructor vacío
    public SuperAdminDTO() {
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
    public String getFotoUrl() {
        return fotoUrl;
    }
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
    public RolDTO getRol() {
        return rol;
    }
    public void setRol(RolDTO rol) {
        this.rol = rol;
    }

    // Clase interna para el rol
    public static class RolDTO {
        private Integer idRol;
        private String nombreRol;

        public RolDTO() {
        }
        public RolDTO(Integer idRol, String nombreRol) {
            this.idRol = idRol;
            this.nombreRol = nombreRol;
        }
        public Integer getIdRol() {
            return idRol;
        }
        public void setIdRol(Integer idRol) {
            this.idRol = idRol;
        }
        public String getNombreRol() {
            return nombreRol;
        }
        public void setNombreRol(String nombreRol) {
            this.nombreRol = nombreRol;
        }
    }
}