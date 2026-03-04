//CORRECTO

package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "super_admins")
@SQLDelete(sql = "UPDATE super_admins SET estado=0 WHERE id_admin=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idAdmin", "nombres", "apellidos", "correo",
    "usuario", "password", "rolPlataforma", "fotoUrl", "estado"
})
public class SuperAdmins {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_admin")
    private Long idAdmin;

    private String nombres;
    private String apellidos;
    private String correo;
    private String usuario;
    private String password;
    @Column(name = "rol_plataforma")
    private String rolPlataforma = "SUPER_ADMIN";

    @Column(name = "foto_url", length = 255)
    private String fotoUrl;

    private Integer estado = 1;

    // Constructor vacio
    public SuperAdmins() {
    }
    public SuperAdmins(Long idAdmin) {
        this.idAdmin = idAdmin;
    }

    // Getters y Setters / toString
    public Long getIdAdmin() {
        return idAdmin;
    }
    public void setIdAdmin(Long idAdmin) {
        this.idAdmin = idAdmin;
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
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRolPlataforma() {
        return rolPlataforma;
    }
    public void setRolPlataforma(String rolPlataforma) {
        this.rolPlataforma = rolPlataforma;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    public String getFotoUrl() {
        return fotoUrl;
    }
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
    @Override
    public String toString() {
        return "SuperAdmins [idAdmin=" + idAdmin + ", nombres=" + nombres + ", apellidos=" + apellidos + ", correo="
                + correo + ", usuario=" + usuario + ", password=" + password + ", rolPlataforma=" + rolPlataforma
                + ", fotoUrl=" + fotoUrl + ", estado=" + estado + "]";
    }
}