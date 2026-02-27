package com.escuelita.www.entity;

import java.math.BigDecimal;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
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
@Table(name = "pago_detalle")
@SQLDelete(sql = "UPDATE pago_detalle SET estado=0 WHERE id_pago_detalle=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idPagoDetalle", "montoAplicado", "idPago", "idDeuda", "estado"
})
public class PagoDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago_detalle")
    private Long idPagoDetalle;

    @Column(name = "monto_aplicado", nullable = false)
    private BigDecimal montoAplicado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_pago")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    @NotFound(action = NotFoundAction.IGNORE)
    private PagosCaja idPago;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_deuda")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    @NotFound(action = NotFoundAction.IGNORE)
    private DeudasAlumno idDeuda;

    private Integer estado = 1;

    //Constructor vacio
    public PagoDetalle() {
    }
    public PagoDetalle(Long idPagoDetalle) {
        this.idPagoDetalle = idPagoDetalle;
    }

    // Getters y Setters / toString
    public Long getIdPagoDetalle() {
        return idPagoDetalle;
    }
    public void setIdPagoDetalle(Long idPagoDetalle) {
        this.idPagoDetalle = idPagoDetalle;
    }
    public BigDecimal getMontoAplicado() {
        return montoAplicado;
    }
    public void setMontoAplicado(BigDecimal montoAplicado) {
        this.montoAplicado = montoAplicado;
    }
    public PagosCaja getIdPago() {
        return idPago;
    }
    public void setIdPago(PagosCaja idPago) {
        this.idPago = idPago;
    }
    public DeudasAlumno getIdDeuda() {
        return idDeuda;
    }
    public void setIdDeuda(DeudasAlumno idDeuda) {
        this.idDeuda = idDeuda;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "PagoDetalle [idPagoDetalle=" + idPagoDetalle + ", montoAplicado=" + montoAplicado + ", idPago=" + idPago
                + ", idDeuda=" + idDeuda + ", estado=" + estado + "]";
    }
}