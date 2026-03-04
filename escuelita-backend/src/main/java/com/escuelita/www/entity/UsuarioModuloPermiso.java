package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "usuario_modulo_permiso",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_usuario", "id_modulo", "id_permiso"})
    }
)
@SQLDelete(sql = "UPDATE usuario_modulo_permiso SET estado=0 WHERE id_ump=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idUmp", "idUsuario", "idModulo", "idPermiso", "estado"
})
public class UsuarioModuloPermiso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ump")
    private Long idUmp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuarios idUsuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_modulo")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Modulos idModulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_permiso")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Permisos idPermiso;

    private Integer estado = 1;

    public UsuarioModuloPermiso() {
    }

    public UsuarioModuloPermiso(Long idUmp) {
        this.idUmp = idUmp;
    }

    // Getters y Setters
    public Long getIdUmp() {
        return idUmp;
    }

    public void setIdUmp(Long idUmp) {
        this.idUmp = idUmp;
    }

    public Usuarios getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Usuarios idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Modulos getIdModulo() {
        return idModulo;
    }

    public void setIdModulo(Modulos idModulo) {
        this.idModulo = idModulo;
    }

    public Permisos getIdPermiso() {
        return idPermiso;
    }

    public void setIdPermiso(Permisos idPermiso) {
        this.idPermiso = idPermiso;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "UsuarioModuloPermiso [idUmp=" + idUmp + ", idUsuario=" + idUsuario + ", idModulo=" + idModulo
                + ", idPermiso=" + idPermiso + ", estado=" + estado + "]";
    }
}
