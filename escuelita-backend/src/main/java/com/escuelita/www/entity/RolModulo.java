package com.escuelita.www.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedStoredProcedureQuery;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureParameter;
import jakarta.persistence.Table;

@Entity
@Table(name = "rol_modulo")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@NamedStoredProcedureQuery(
    name = "validarAccesoModuloUsuario",
    procedureName = "validar_acceso_modulo_usuario",
    parameters = {
        @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_idUsuario", type = Long.class),
        @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_idModulo", type = Long.class),
        @StoredProcedureParameter(mode = ParameterMode.OUT, name = "resultado", type = Integer.class)
    }
)
public class RolModulo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol_modulo")
    private Long idRolModulo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Roles idRol;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_modulo")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Modulos idModulo;
    
    @Column(name = "estado")
    private Integer estado = 1;
    
    // Constructores
    public RolModulo() {
    }
    
    public RolModulo(Roles idRol, Modulos idModulo, Integer estado) {
        this.idRol = idRol;
        this.idModulo = idModulo;
        this.estado = estado;
    }
    
    // Getters y Setters
    public Long getIdRolModulo() {
        return idRolModulo;
    }
    
    public void setIdRolModulo(Long idRolModulo) {
        this.idRolModulo = idRolModulo;
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
    
    public Integer getEstado() {
        return estado;
    }
    
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    
    @Override
    public String toString() {
        return "RolModulo{" +
                "idRolModulo=" + idRolModulo +
                ", idRol=" + (idRol != null ? idRol.getIdRol() : null) +
                ", idModulo=" + (idModulo != null ? idModulo.getIdModulo() : null) +
                ", estado=" + estado +
                '}';
    }
}
