package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
@SQLDelete(sql = "UPDATE usuarios SET estado=0 WHERE id_usuario=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idUsuario", "idSede", "idRol", "idTipoDoc", "numeroDocumento", 
    "apellidos", "nombres", "correo", "usuario", "contrasena", "fotoPerfil", "estado"
})
public class Usuarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "numero_documento")
    private String numeroDocumento;

    private String apellidos;
    private String nombres;
    private String correo;
    private String usuario;
    private String contrasena;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sede")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Sedes idSede;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Roles idRol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_doc")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TipoDocumentos idTipoDoc;

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
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

    public Sedes getIdSede() {
        return idSede;
    }

    public void setIdSede(Sedes idSede) {
        this.idSede = idSede;
    }

    public Roles getIdRol() {
        return idRol;
    }

    public void setIdRol(Roles idRol) {
        this.idRol = idRol;
    }

    public TipoDocumentos getIdTipoDoc() {
        return idTipoDoc;
    }

    public void setIdTipoDoc(TipoDocumentos idTipoDoc) {
        this.idTipoDoc = idTipoDoc;
    }

    @Override
    public String toString() {
        return "Usuarios [idUsuario=" + idUsuario + ", numeroDocumento=" + numeroDocumento + ", apellidos=" + apellidos
                + ", nombres=" + nombres + ", correo=" + correo + ", usuario=" + usuario + ", contrasena=" + contrasena
                + ", fotoPerfil=" + fotoPerfil + ", estado=" + estado + ", idSede=" + idSede + ", idRol=" + idRol
                + ", idTipoDoc=" + idTipoDoc + "]";
    }

   
}