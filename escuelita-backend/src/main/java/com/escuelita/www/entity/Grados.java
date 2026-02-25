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
@Table(name = "grados")
@SQLDelete(sql = "UPDATE grados SET estado=0 WHERE id_grado=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idGrado", "nombreGrado", "idSede", "estado"
})
public class Grados {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grado")
    private Long idGrado;
    
    @Column(name = "nombre_grado", length = 50)
    private String nombreGrado;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sede", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Sedes idSede;
    
    private Integer estado = 1;

    //Constructor vacio
    public Grados() {}
    public Grados(Long idGrado) {
        this.idGrado = idGrado;
    }

    //Getters y Setters / ToString
    public Long getIdGrado() {
        return idGrado;
    }
    public void setIdGrado(Long idGrado) {
        this.idGrado = idGrado;
    }
    public String getNombreGrado() {
        return nombreGrado;
    }
    public void setNombreGrado(String nombreGrado) {
        this.nombreGrado = nombreGrado;
    }
    public Sedes getIdSede() {
        return idSede;
    }
    public void setIdSede(Sedes idSede) {
        this.idSede = idSede;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Grados [idGrado=" + idGrado + ", nombreGrado=" + nombreGrado
                + ", idSede=" + idSede + ", estado=" + estado + "]";
    }
}