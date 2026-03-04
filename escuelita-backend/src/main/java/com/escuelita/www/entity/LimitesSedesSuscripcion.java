//CORRECTO

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

@Entity
@Table(name = "limites_sedes_suscripcion")
@SQLDelete(sql = "UPDATE limites_sedes_suscripcion SET estado=0 WHERE id_limite_sede=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idLimiteSede", "limiteAlumnosAsignado", "idSuscripcion", "idSede", "estado"
})
public class LimitesSedesSuscripcion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_limite_sede")
    private Long idLimiteSede;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_suscripcion", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Suscripciones idSuscripcion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sede", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Sedes idSede;
    
    @Column(name = "limite_alumnos_asignado", nullable = false)
    private Integer limiteAlumnosAsignado;
    
    @Column(name = "estado")
    private Integer estado = 1;
    
    // Constructor vacío
    public LimitesSedesSuscripcion() {
    }
    
    public LimitesSedesSuscripcion(Long idLimiteSede) {
        this.idLimiteSede = idLimiteSede;
    }
    
    // Getters y Setters
    public Long getIdLimiteSede() {
        return idLimiteSede;
    }
    
    public void setIdLimiteSede(Long idLimiteSede) {
        this.idLimiteSede = idLimiteSede;
    }
    
    public Suscripciones getIdSuscripcion() {
        return idSuscripcion;
    }
    
    public void setIdSuscripcion(Suscripciones idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }
    
    public Sedes getIdSede() {
        return idSede;
    }
    
    public void setIdSede(Sedes idSede) {
        this.idSede = idSede;
    }
    
    public Integer getLimiteAlumnosAsignado() {
        return limiteAlumnosAsignado;
    }
    
    public void setLimiteAlumnosAsignado(Integer limiteAlumnosAsignado) {
        this.limiteAlumnosAsignado = limiteAlumnosAsignado;
    }
    
    public Integer getEstado() {
        return estado;
    }
    
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    
    @Override
    public String toString() {
        return "LimitesSedesSuscripcion [idLimiteSede=" + idLimiteSede 
                + ", limiteAlumnosAsignado=" + limiteAlumnosAsignado 
                + ", idSuscripcion=" + (idSuscripcion != null ? idSuscripcion.getIdSuscripcion() : null)
                + ", idSede=" + (idSede != null ? idSede.getIdSede() : null)
                + ", estado=" + estado + "]";
    }
}
