package com.escuelita.www.entity;

import java.time.LocalTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "horarios")
@SQLDelete(sql = "UPDATE horarios SET estado=0 WHERE id_horario=?")
@SQLRestriction("estado = 1")
public class Horarios {

    public Long getId_horario() {
        return id_horario;
    }

    public void setId_horario(Long id_horario) {
        this.id_horario = id_horario;
    }

    public AsignacionDocente getAsignacion() {
        return asignacion;
    }

    public void setAsignacion(AsignacionDocente asignacion) {
        this.asignacion = asignacion;
    }

    public Aulas getAula() {
        return aula;
    }

    public void setAula(Aulas aula) {
        this.aula = aula;
    }

    public String getDia_semana() {
        return dia_semana;
    }

    public void setDia_semana(String dia_semana) {
        this.dia_semana = dia_semana;
    }

    public LocalTime getHora_inicio() {
        return hora_inicio;
    }

    public void setHora_inicio(LocalTime hora_inicio) {
        this.hora_inicio = hora_inicio;
    }

    public LocalTime getHora_fin() {
        return hora_fin;
    }

    public void setHora_fin(LocalTime hora_fin) {
        this.hora_fin = hora_fin;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_horario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignacion")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private AsignacionDocente asignacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_aula")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Aulas aula; // Necesitas crear Aulas

    private String dia_semana;
    private LocalTime hora_inicio;
    private LocalTime hora_fin;
    private Integer estado = 1;

    // Generar Getters, Setters y Constructores aquí
}