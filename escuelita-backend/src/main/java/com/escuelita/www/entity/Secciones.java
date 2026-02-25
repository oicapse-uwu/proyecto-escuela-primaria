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
@Table(name = "secciones")
@SQLDelete(sql = "UPDATE secciones SET estado=0 WHERE id_seccion=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idSeccion", "nombreSeccion", "vacantes", "idGrado", "idSede", "estado"
})
public class Secciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_seccion")
    private Long idSeccion;

    @Column(name = "nombre_seccion", length = 10)
    private String nombreSeccion;
    private Integer vacantes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grado", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Grados idGrado;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sede", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Sedes idSede;

    private Integer estado = 1;

    //Constructor vacio
    public Secciones() {}
    public Secciones(Long idSeccion) {
        this.idSeccion = idSeccion;
    }

    //Getters y Setters / ToString
    public Long getIdSeccion() {
        return idSeccion;
    }
    public void setIdSeccion(Long idSeccion) {
        this.idSeccion = idSeccion;
    }
    public String getNombreSeccion() {
        return nombreSeccion;
    }
    public void setNombreSeccion(String nombreSeccion) {
        this.nombreSeccion = nombreSeccion;
    }
    public Integer getVacantes() {
        return vacantes;
    }
    public void setVacantes(Integer vacantes) {
        this.vacantes = vacantes;
    }
        public Grados getIdGrado() {
        return idGrado;
    }
    public void setIdGrado(Grados idGrado) {
        this.idGrado = idGrado;
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
        return "Secciones [idSeccion=" + idSeccion + ", nombreSeccion=" + nombreSeccion + ", vacantes=" + vacantes
                + ", idGrado=" + idGrado + ", idSede=" + idSede + ", estado=" + estado + "]";
    }
}