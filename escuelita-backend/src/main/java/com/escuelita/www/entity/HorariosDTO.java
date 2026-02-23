package com.escuelita.www.entity;

import java.time.LocalTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@Table(name = "horarios")
@SQLDelete(sql = "UPDATE horarios SET estado=0 WHERE id_horario=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({ "id_horario", "dia_semana", "hora_inicio", "hora_fin", "estado", "id_asignacion", "id_aula" })
public class HorariosDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_horario;

    private String dia_semana;
    private LocalTime hora_inicio;
    private LocalTime hora_fin;
    private Long id_asignacion;
    private Long id_aula;
    private Integer estado = 1;

    public Long getId_horario() {
        return id_horario;
    }

    public void setId_horario(Long id_horario) {
        this.id_horario = id_horario;
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

    public Long getId_asignacion() {
        return id_asignacion;
    }

    public void setId_asignacion(Long id_asignacion) {
        this.id_asignacion = id_asignacion;
    }

    public Long getId_aula() {
        return id_aula;
    }

    public void setId_aula(Long id_aula) {
        this.id_aula = id_aula;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "HorariosDTO [id_horario=" + id_horario + ", dia_semana=" + dia_semana + ", hora_inicio=" + hora_inicio
                + ", hora_fin=" + hora_fin + ", id_asignacion=" + id_asignacion + ", id_aula=" + id_aula + ", estado="
                + estado + "]";
    }
}