package com.escuelita.www.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;

@Entity
@Table(name = "pagos_caja")
@SQLDelete(sql = "UPDATE pagos_caja SET estado=0 WHERE id_pago=?")
@SQLRestriction("estado = 1")
public class PagosCaja {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long idPago;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_metodo", nullable = false)
    private MetodosPago metodo; 
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuarios usuario; 
    
    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;
    
    @Column(name = "monto_total_pagado", nullable = false)
    private BigDecimal montoTotalPagado;
    
    @Column(name = "comprobante_numero", length = 50)
    private String comprobanteNumero;
    
    @Column(name = "observacion_pago", columnDefinition = "TEXT")
    private String observacionPago;
    
    private Integer estado = 1;

    // Métodos para asignar la fecha automáticamente antes de guardar si viene vacía
    @PrePersist
    public void prePersist() {
        if (fechaPago == null) {
            fechaPago = LocalDateTime.now();
        }
    }

    // Getters y Setters
    public Long getIdPago() { return idPago; }
    public void setIdPago(Long idPago) { this.idPago = idPago; }

    public MetodosPago getMetodo() { return metodo; }
    public void setMetodo(MetodosPago metodo) { this.metodo = metodo; }

    public Usuarios getUsuario() { return usuario; }
    public void setUsuario(Usuarios usuario) { this.usuario = usuario; }

    public LocalDateTime getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDateTime fechaPago) { this.fechaPago = fechaPago; }

    public BigDecimal getMontoTotalPagado() { return montoTotalPagado; }
    public void setMontoTotalPagado(BigDecimal montoTotalPagado) { this.montoTotalPagado = montoTotalPagado; }

    public String getComprobanteNumero() { return comprobanteNumero; }
    public void setComprobanteNumero(String comprobanteNumero) { this.comprobanteNumero = comprobanteNumero; }

    public String getObservacionPago() { return observacionPago; }
    public void setObservacionPago(String observacionPago) { this.observacionPago = observacionPago; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }
}