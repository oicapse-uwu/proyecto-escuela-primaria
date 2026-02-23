package com.escuelita.www.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "promedios_periodo")
@SQLDelete(sql = "UPDATE promedios_periodo SET estado=0 WHERE id_promedio=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_promedio", "id_asignacion", "id_matricula", "id_periodo", 
    "nota_final_area", "comentario_libreta", "estado_cierre", "estado"
})
public class PromediosPeriodo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_promedio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignacion")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AsignacionDocente id_asignacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_matricula")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Matriculas id_matricula;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_periodo")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Periodos id_periodo;

    @Column(length = 10)
    private String nota_final_area;

    @Column(length = 255)
    private String comentario_libreta;

    @Column(columnDefinition = "ENUM('Abierto', 'Cerrado_Enviado')")
    private String estado_cierre;

    private Integer estado = 1;

    public PromediosPeriodo() {}

    public Long getId_promedio() {
        return id_promedio;
    }

    public void setId_promedio(Long id_promedio) {
        this.id_promedio = id_promedio;
    }

    public AsignacionDocente getId_asignacion() {
        return id_asignacion;
    }

    public void setId_asignacion(AsignacionDocente id_asignacion) {
        this.id_asignacion = id_asignacion;
    }

    public Matriculas getId_matricula() {
        return id_matricula;
    }

    public void setId_matricula(Matriculas id_matricula) {
        this.id_matricula = id_matricula;
    }

    public Periodos getId_periodo() {
        return id_periodo;
    }

    public void setId_periodo(Periodos id_periodo) {
        this.id_periodo = id_periodo;
    }

    public String getNota_final_area() {
        return nota_final_area;
    }

    public void setNota_final_area(String nota_final_area) {
        this.nota_final_area = nota_final_area;
    }

    public String getComentario_libreta() {
        return comentario_libreta;
    }

    public void setComentario_libreta(String comentario_libreta) {
        this.comentario_libreta = comentario_libreta;
    }

    public String getEstado_cierre() {
        return estado_cierre;
    }

    public void setEstado_cierre(String estado_cierre) {
        this.estado_cierre = estado_cierre;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "PromediosPeriodo [id_promedio=" + id_promedio + ", id_asignacion=" + id_asignacion + ", id_matricula="
                + id_matricula + ", id_periodo=" + id_periodo + ", nota_final_area=" + nota_final_area
                + ", comentario_libreta=" + comentario_libreta + ", estado_cierre=" + estado_cierre + ", estado="
                + estado + "]";
    }


    
}