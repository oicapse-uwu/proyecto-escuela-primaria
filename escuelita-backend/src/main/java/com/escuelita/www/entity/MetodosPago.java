//CORRECTO

package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.*;

@Entity
@Table(name = "metodos_pago")
@SQLDelete(sql = "UPDATE metodos_pago SET estado=0 WHERE id_metodo=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idMetodo", "nombreMetodo", "requiereComprobante", "estado"
})
public class MetodosPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_metodo")
    private Long idMetodo;
    
    @Column(name = "nombre_metodo", nullable = false, length = 50, unique = true)
    private String nombreMetodo;
    @Column(name = "requiere_comprobante")
    private Integer requiereComprobante = 1;
    
    private Integer estado = 1;

    //Constructor vacio
    public MetodosPago() {
    }
    public MetodosPago(Long idMetodo) {
        this.idMetodo = idMetodo;
    }

    // Getters y Setters / toString
    public Long getIdMetodo() {
        return idMetodo;
    }
    public void setIdMetodo(Long idMetodo) {
        this.idMetodo = idMetodo;
    }
    public String getNombreMetodo() {
        return nombreMetodo;
    }
    public void setNombreMetodo(String nombreMetodo) {
        this.nombreMetodo = nombreMetodo;
    }
    public Integer getRequiereComprobante() {
        return requiereComprobante;
    }
    public void setRequiereComprobante(Integer requiereComprobante) {
        this.requiereComprobante = requiereComprobante;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "MetodosPago [idMetodo=" + idMetodo + ", nombreMetodo=" + nombreMetodo + ", requiereComprobante="
                + requiereComprobante + ", estado=" + estado + "]";
    }
}