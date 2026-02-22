package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "planes")
@SQLDelete(sql = "UPDATE planes SET estado=0 WHERE id_plan=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idPlan", "nombrePlan", "descripcion", "precioMensual", "precioAnual", "limiteAlumnos", "limiteSedes", "estado"
})
public class Planes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plan")
    private Long idPlan;

    @Column(name = "nombre_plan")
    private String nombrePlan;

    private String descripcion;

    @Column(name = "precio_mensual")
    private Double precioMensual;

    @Column(name = "precio_anual")
    private Double precioAnual;

    @Column(name = "limite_alumnos")
    private Integer limiteAlumnos;

    @Column(name = "limite_sedes")
    private Integer limiteSedes;

    private Integer estado = 1;

    public Planes() {}

    public Planes(Long id) {
        this.idPlan = id;
    }

    public Long getIdPlan() {
        return idPlan;
    }

    public void setIdPlan(Long idPlan) {
        this.idPlan = idPlan;
    }

    public String getNombrePlan() {
        return nombrePlan;
    }

    public void setNombrePlan(String nombrePlan) {
        this.nombrePlan = nombrePlan;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getPrecioMensual() {
        return precioMensual;
    }

    public void setPrecioMensual(Double precioMensual) {
        this.precioMensual = precioMensual;
    }

    public Double getPrecioAnual() {
        return precioAnual;
    }

    public void setPrecioAnual(Double precioAnual) {
        this.precioAnual = precioAnual;
    }

    public Integer getLimiteAlumnos() {
        return limiteAlumnos;
    }

    public void setLimiteAlumnos(Integer limiteAlumnos) {
        this.limiteAlumnos = limiteAlumnos;
    }

    public Integer getLimiteSedes() {
        return limiteSedes;
    }

    public void setLimiteSedes(Integer limiteSedes) {
        this.limiteSedes = limiteSedes;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Planes [idPlan=" + idPlan + ", nombrePlan=" + nombrePlan + ", descripcion=" + descripcion
                + ", precioMensual=" + precioMensual + ", precioAnual=" + precioAnual + ", limiteAlumnos="
                + limiteAlumnos + ", limiteSedes=" + limiteSedes + ", estado=" + estado + "]";
    }


}