package com.escuelita.www.entity;

import java.math.BigDecimal;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pago_detalle")
@SQLDelete(sql = "UPDATE pago_detalle SET estado=0 WHERE id_pago_detalle=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idPagoDetalle", "idPago", "idDeuda", "montoAplicado", "estado"
})
public class PagoDetalle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago_detalle")
    private Long idPagoDetalle;
    
    @Column(name = "id_pago")
    private Long idPago;
    
    @Column(name = "id_deuda")
    private Long idDeuda;
    
    @Column(name = "monto_aplicado")
    private BigDecimal montoAplicado;
    
    private Integer estado = 1;

    // Getters y Setters
    public Long getIdPagoDetalle() { return idPagoDetalle; }
    public void setIdPagoDetalle(Long idPagoDetalle) { this.idPagoDetalle = idPagoDetalle; }

    public Long getIdPago() { return idPago; }
    public void setIdPago(Long idPago) { this.idPago = idPago; }

    public Long getIdDeuda() { return idDeuda; }
    public void setIdDeuda(Long idDeuda) { this.idDeuda = idDeuda; }

    public BigDecimal getMontoAplicado() { return montoAplicado; }
    public void setMontoAplicado(BigDecimal montoAplicado) { this.montoAplicado = montoAplicado; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }

    @Override
    public String toString() {
        return "PagoDetalle [idPagoDetalle=" + idPagoDetalle + ", idPago=" + idPago + 
               ", idDeuda=" + idDeuda + ", montoAplicado=" + montoAplicado + 
               ", estado=" + estado + "]";
    }
}