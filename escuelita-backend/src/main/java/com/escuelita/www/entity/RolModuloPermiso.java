package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "rol_modulo_permiso")
@SQLDelete(sql = "UPDATE rol_modulo_permiso SET estado=0 WHERE id_rmp=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idRmp", "idRol", "idModulo", "idPermiso", "estado"
})
public class RolModuloPermiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rmp")
    private Long idRmp;

    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Roles idRol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_modulo")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Modulos idModulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_permiso")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Permisos idPermiso;

    public Long getIdRmp() {
        return idRmp;
    }

    public void setIdRmp(Long idRmp) {
        this.idRmp = idRmp;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public Roles getIdRol() {
        return idRol;
    }

    public void setIdRol(Roles idRol) {
        this.idRol = idRol;
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

    @Override
    public String toString() {
        return "RolModuloPermiso [idRmp=" + idRmp + ", estado=" + estado + ", idRol=" + idRol + ", idModulo=" + idModulo
                + ", idPermiso=" + idPermiso + "]";
    }

 
}
