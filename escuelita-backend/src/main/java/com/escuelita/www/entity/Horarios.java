package com.escuelita.www.entity;

import java.time.LocalTime;

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
@Table(name = "horarios")
@SQLDelete(sql = "UPDATE horarios SET estado=0 WHERE id_horario=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idHorario", "diaSemana", "horaInicio", "horaFin", "idAsignacion", "idAula", "estado" 
})
public class Horarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario")
    private Long idHorario;

    @Column(name = "dia_semana")
    private String diaSemana;
    
    @Column(name = "hora_inicio")
    private LocalTime horaInicio;
    
    @Column(name = "hora_fin")
    private LocalTime horaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignacion")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private AsignacionDocente idAsignacion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_aula")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Aulas idAula;

    private Integer estado = 1;

    //Constructor vacio
    public Horarios() {
    }
    public Horarios(Long idHorario) {
        this.idHorario = idHorario;
    }

    //Getters y Setters / ToString
    public Long getIdHorario() {
        return idHorario;
    }
    public void setIdHorario(Long idHorario) {
        this.idHorario = idHorario;
    }
    public String getDiaSemana() {
        return diaSemana;
    }
    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }
    public LocalTime getHoraInicio() {
        return horaInicio;
    }
    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }
    public LocalTime getHoraFin() {
        return horaFin;
    }
    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }
    public AsignacionDocente getIdAsignacion() {
        return idAsignacion;
    }
    public void setIdAsignacion(AsignacionDocente idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    public Aulas getIdAula() {
        return idAula;
    }
    public void setIdAula(Aulas idAula) {
        this.idAula = idAula;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Horarios [idHorario=" + idHorario + ", diaSemana=" + diaSemana + ", horaInicio=" + horaInicio
                + ", horaFin=" + horaFin + ", idAsignacion=" + idAsignacion + ", idAula=" + idAula + ", estado=" + estado + "]";
    }
}