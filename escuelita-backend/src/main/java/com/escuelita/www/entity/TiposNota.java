package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "tipos_nota")
@SQLDelete(sql = "UPDATE tipos_nota SET estado=0 WHERE id_tipo_nota=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_tipo_nota", "nombre", "formato", "valor_minimo", "valor_maximo", "estado"
})
public class TiposNota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_tipo_nota;

    @Column(length = 50)
    private String nombre;

    @Column(columnDefinition = "ENUM('NUMERO', 'LETRA', 'SIMBOLO')")
    private String formato;

    @Column(length = 10)
    private String valor_minimo;

    @Column(length = 10)
    private String valor_maximo;

    @Column(nullable = false)
    private Integer estado = 1;

    public TiposNota() {}
    public TiposNota(Long id_tipo_nota) { this.id_tipo_nota = id_tipo_nota; }

    // Getters y Setters

    public Long getId_tipo_nota() {
        return id_tipo_nota;
    }
    public void setId_tipo_nota(Long id_tipo_nota) {
        this.id_tipo_nota = id_tipo_nota;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getFormato() {
        return formato;
    }
    public void setFormato(String formato) {
        this.formato = formato;
    }
    public String getValor_minimo() {
        return valor_minimo;
    }
    public void setValor_minimo(String valor_minimo) {
        this.valor_minimo = valor_minimo;
    }
    public String getValor_maximo() {
        return valor_maximo;
    }
    public void setValor_maximo(String valor_maximo) {
        this.valor_maximo = valor_maximo;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "TiposNota [id_tipo_nota=" + id_tipo_nota + ", nombre=" + nombre + ", formato=" + formato + "]";
    }
}