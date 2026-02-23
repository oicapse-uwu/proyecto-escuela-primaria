package com.escuelita.www.entity;

import java.time.LocalTime;

public class HorariosDTO {

    private Long idHorario;
    private String diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private Long idAsignacion;
    private Long idAula;
    private Integer estado = 1;

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
    public Long getIdAsignacion() {
        return idAsignacion;
    }
    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }
    public Long getIdAula() {
        return idAula;
    }
    public void setIdAula(Long idAula) {
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
        return "HorariosDTO [idHorario=" + idHorario + ", diaSemana=" + diaSemana + ", horaInicio=" + horaInicio
                + ", horaFin=" + horaFin + ", idAsignacion=" + idAsignacion + ", idAula=" + idAula + ", estado="
                + estado + "]";
    }
}