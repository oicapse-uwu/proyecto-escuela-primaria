package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "tipo_documentos")
@SQLDelete(sql = "UPDATE tipo_documentos SET estado=0 WHERE id_documento=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idDocumento", "abreviatura", "descripcion", "longitudMaxima", "esLongitudExacta", "estado"
})
public class TipoDocumentos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Long idDocumento;

    private String abreviatura;
    private String descripcion;

    @Column(name = "longitud_maxima")
    private Integer longitudMaxima;

    @Column(name = "es_longitud_exacta")
    private Integer esLongitudExacta = 1;

    private Integer estado = 1;

    public TipoDocumentos() {}

    public TipoDocumentos(Long id) {
        this.idDocumento = id;
    }

    public Long getIdDocumento() {
        return idDocumento;
    }

    public void setIdDocumento(Long idDocumento) {
        this.idDocumento = idDocumento;
    }

    public String getAbreviatura() {
        return abreviatura;
    }

    public void setAbreviatura(String abreviatura) {
        this.abreviatura = abreviatura;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getLongitudMaxima() {
        return longitudMaxima;
    }

    public void setLongitudMaxima(Integer longitudMaxima) {
        this.longitudMaxima = longitudMaxima;
    }

    public Integer getEsLongitudExacta() {
        return esLongitudExacta;
    }

    public void setEsLongitudExacta(Integer esLongitudExacta) {
        this.esLongitudExacta = esLongitudExacta;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "TipoDocumentos [idDocumento=" + idDocumento + ", abreviatura=" + abreviatura + ", descripcion="
                + descripcion + ", longitudMaxima=" + longitudMaxima + ", esLongitudExacta=" + esLongitudExacta
                + ", estado=" + estado + "]";
    }


}