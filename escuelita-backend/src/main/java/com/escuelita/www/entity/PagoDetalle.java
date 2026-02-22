package com.escuelita.www.entity;

import java.math.BigDecimal;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "pago_detalle")
@SQLDelete(sql = "UPDATE pago_detalle SET estado=0 WHERE id_pago_detalle=?")
@SQLRestriction("estado = 1")
public class PagoDetalle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago_detalle")
    private Long idPagoDetalle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pago", nullable = false)
    private PagosCaja pago;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_deuda", nullable = false)
    private DeudasAlumno deuda;
    
    @Column(name = "monto_aplicado", nullable = false)
    private BigDecimal montoAplicado;
    
    private Integer estado = 1;

    // Getters y Setters
    public Long getIdPagoDetalle() { return idPagoDetalle; }
    public void setIdPagoDetalle(Long idPagoDetalle) { this.idPagoDetalle = idPagoDetalle; }

    public PagosCaja getPago() { return pago; }
    public void setPago(PagosCaja pago) { this.pago = pago; }

    public DeudasAlumno getDeuda() { return deuda; }
    public void setDeuda(DeudasAlumno deuda) { this.deuda = deuda; }

    public BigDecimal getMontoAplicado() { return montoAplicado; }
    public void setMontoAplicado(BigDecimal montoAplicado) { this.montoAplicado = montoAplicado; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }
}