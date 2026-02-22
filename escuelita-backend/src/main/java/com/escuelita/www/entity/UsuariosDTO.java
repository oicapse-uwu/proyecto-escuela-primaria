package com.escuelita.www.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class UsuariosDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    private Long idSede;
    private Long idRol;
    private Long idTipoDoc;
    private String numeroDocumento;
    private String apellidos;
    private String nombres;
    private String correo;
    private String usuario;
    private String contrasena;
    private String fotoPerfil;
    private Integer estado = 1;
    public Long getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
    public Long getIdSede() {
        return idSede;
    }
    public void setIdSede(Long idSede) {
        this.idSede = idSede;
    }
    public Long getIdRol() {
        return idRol;
    }
    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }
    public Long getIdTipoDoc() {
        return idTipoDoc;
    }
    public void setIdTipoDoc(Long idTipoDoc) {
        this.idTipoDoc = idTipoDoc;
    }
    public String getNumeroDocumento() {
        return numeroDocumento;
    }
    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }
    public String getApellidos() {
        return apellidos;
    }
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    public String getNombres() {
        return nombres;
    }
    public void setNombres(String nombres) {
        this.nombres = nombres;
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
    public String getContrasena() {
        return contrasena;
    }
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    public String getFotoPerfil() {
        return fotoPerfil;
    }
    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "UsuariosDTO [idUsuario=" + idUsuario + ", idSede=" + idSede + ", idRol=" + idRol + ", idTipoDoc="
                + idTipoDoc + ", numeroDocumento=" + numeroDocumento + ", apellidos=" + apellidos + ", nombres="
                + nombres + ", correo=" + correo + ", usuario=" + usuario + ", contrasena=" + contrasena
                + ", fotoPerfil=" + fotoPerfil + ", estado=" + estado + "]";
    }


}