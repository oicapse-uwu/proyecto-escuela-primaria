package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "tipos_nota")
@SQLDelete(sql = "UPDATE tipos_nota SET estado=0 WHERE id_tipo_nota=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
        "idTipoNota", "nombre", "formato", "valorMinimo", "valorMaximo", "estado"
    })
public class TiposNota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_nota")
    private Long idTipoNota;

    @Column(length = 50, nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String formato;

    @Column(name = "valor_minimo", length = 10)
    private String valorMinimo;

    @Column(name = "valor_maximo", length = 10)
    private String valorMaximo;

    private Integer estado = 1;

    
    public TiposNota() {}

    public Long getIdTipoNota() {
        return idTipoNota;
    }

    public void setIdTipoNota(Long idTipoNota) {
        this.idTipoNota = idTipoNota;
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

    public String getValorMinimo() {
        return valorMinimo;
    }

    public void setValorMinimo(String valorMinimo) {
        this.valorMinimo = valorMinimo;
    }

    public String getValorMaximo() {
        return valorMaximo;
    }

    public void setValorMaximo(String valorMaximo) {
        this.valorMaximo = valorMaximo;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "TiposNota [idTipoNota=" + idTipoNota + ", nombre=" + nombre +
                ", formato=" + formato + ", valorMinimo=" + valorMinimo +
                ", valorMaximo=" + valorMaximo + ", estado=" + estado + "]";
    }
}