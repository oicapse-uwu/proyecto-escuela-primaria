//CORRECTO

package com.escuelita.www.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
@Table(name = "matriculas")
@SQLDelete(sql = "UPDATE matriculas SET estado=0 WHERE id_matricula=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idMatricula", "codigoMatricula", "fechaMatricula", "fechaVencimientoPago",
    "tipoIngreso", "estadoMatricula", "vacanteGarantizada", "fechaPagoMatricula",
    "observaciones", "idAlumno", "idSeccion", "idAnio", "estado"
})
public class Matriculas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_matricula")
    private Long idMatricula;
    
    @Column(name = "codigo_matricula", length = 30, unique = true)
    private String codigoMatricula;
    @Column(name = "fecha_matricula", nullable = false)
    private LocalDateTime fechaMatricula;
    @Column(name = "fecha_vencimiento_pago")
    private LocalDateTime fechaVencimientoPago;
    @Column(name = "tipo_ingreso", 
            columnDefinition = "ENUM('Nuevo', 'Promovido', 'Repitente', 'Trasladado_Entrante')", nullable = false)
    private String tipoIngreso;
    @Column(name = "estado_matricula", 
            columnDefinition = "ENUM('Pendiente_Pago', 'Activa', 'Finalizada', 'Cancelada')", nullable = false)
    private String estadoMatricula;
    @Column(name = "vacante_garantizada")
    private Boolean vacanteGarantizada = false;
    @Column(name = "fecha_pago_matricula")
    private LocalDateTime fechaPagoMatricula;
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_alumno")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Alumnos idAlumno;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_seccion")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Secciones idSeccion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_anio")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private AnioEscolar idAnio;

    private Integer estado = 1;

    //Constructor vacio
    public Matriculas() {}
    public Matriculas(Long idMatricula) {
        this.idMatricula = idMatricula;
    }

    //Getters y Setters / ToString
    public Long getIdMatricula() {
        return idMatricula;
    }
    public void setIdMatricula(Long idMatricula) {
        this.idMatricula = idMatricula;
    }
    public String getCodigoMatricula() {
        return codigoMatricula;
    }
    public void setCodigoMatricula(String codigoMatricula) {
        this.codigoMatricula = codigoMatricula;
    }
    public LocalDateTime getFechaMatricula() {
        return fechaMatricula;
    }
    public void setFechaMatricula(LocalDateTime fechaMatricula) {
        this.fechaMatricula = fechaMatricula;
    }
    public LocalDateTime getFechaVencimientoPago() {
        return fechaVencimientoPago;
    }
    public void setFechaVencimientoPago(LocalDateTime fechaVencimientoPago) {
        this.fechaVencimientoPago = fechaVencimientoPago;
    }
    public String getTipoIngreso() {
        return tipoIngreso;
    }
    public void setTipoIngreso(String tipoIngreso) {
        this.tipoIngreso = tipoIngreso;
    }
    public String getEstadoMatricula() {
        return estadoMatricula;
    }
    public void setEstadoMatricula(String estadoMatricula) {
        this.estadoMatricula = estadoMatricula;
    }
    public Boolean getVacanteGarantizada() {
        return vacanteGarantizada;
    }
    public void setVacanteGarantizada(Boolean vacanteGarantizada) {
        this.vacanteGarantizada = vacanteGarantizada;
    }
    public LocalDateTime getFechaPagoMatricula() {
        return fechaPagoMatricula;
    }
    public void setFechaPagoMatricula(LocalDateTime fechaPagoMatricula) {
        this.fechaPagoMatricula = fechaPagoMatricula;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public Alumnos getIdAlumno() {
        return idAlumno;
    }
    public void setIdAlumno(Alumnos idAlumno) {
        this.idAlumno = idAlumno;
    }
    public Secciones getIdSeccion() {
        return idSeccion;
    }
    public void setIdSeccion(Secciones idSeccion) {
        this.idSeccion = idSeccion;
    }
    public AnioEscolar getIdAnio() {
        return idAnio;
    }
    public void setIdAnio(AnioEscolar idAnio) {
        this.idAnio = idAnio;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Matriculas [idMatricula=" + idMatricula + ", codigoMatricula=" + codigoMatricula + ", fechaMatricula="
                + fechaMatricula + ", fechaVencimientoPago=" + fechaVencimientoPago + ", tipoIngreso=" + tipoIngreso
                + ", estadoMatricula=" + estadoMatricula + ", vacanteGarantizada=" + vacanteGarantizada 
                + ", fechaPagoMatricula=" + fechaPagoMatricula + ", observaciones=" + observaciones 
                + ", idAlumno=" + idAlumno + ", idSeccion=" + idSeccion + ", idAnio=" 
                + idAnio + ", estado=" + estado + "]";
    }
}