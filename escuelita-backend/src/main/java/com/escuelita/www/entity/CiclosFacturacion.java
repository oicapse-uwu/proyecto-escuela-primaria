package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "ciclos_facturacion")
@SQLDelete(sql = "UPDATE ciclos_facturacion SET estado=0 WHERE id_ciclo=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idCiclo", "nombre", "mesesDuracion", "estado"
})
public class CiclosFacturacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ciclo")
    private Long idCiclo;

    private String nombre;

    @Column(name = "meses_duracion")
    private Integer mesesDuracion;

    private Integer estado = 1;

    public CiclosFacturacion() {}

    public CiclosFacturacion(Long id) {
        this.idCiclo = id;
    }

    public Long getIdCiclo() {
        return idCiclo;
    }

    public void setIdCiclo(Long idCiclo) {
        this.idCiclo = idCiclo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getMesesDuracion() {
        return mesesDuracion;
    }

    public void setMesesDuracion(Integer mesesDuracion) {
        this.mesesDuracion = mesesDuracion;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "CiclosFacturacion [idCiclo=" + idCiclo + ", nombre=" + nombre + ", mesesDuracion=" + mesesDuracion
                + ", estado=" + estado + "]";
    }



}