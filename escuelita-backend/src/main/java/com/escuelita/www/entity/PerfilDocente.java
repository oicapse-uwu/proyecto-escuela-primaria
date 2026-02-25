//CORRECTO

package com.escuelita.www.entity;

import java.time.LocalDate;

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
@Table(name = "perfil_docente")
@SQLDelete(sql = "UPDATE perfil_docente SET estado=0 WHERE id_docente=?")
@SQLRestriction("estado = 1")@JsonPropertyOrder({
    "idDocente", "gradoAcademico", "fechaContratacion", 
    "estadoLaboral", "idUsuario", "idEspecialidad", "estado"
})
public class PerfilDocente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_docente")
    private Long idDocente;

    @Column(name = "grado_academico")
    private String gradoAcademico;
    @Column(name = "fecha_contratacion")
    private LocalDate fechaContratacion;
    @Column(name = "estado_laboral")
    private String estadoLaboral;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Usuarios idUsuario;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_especialidad")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Especialidades idEspecialidad;

    private Integer estado = 1;

    //Constructor vacio
    public PerfilDocente() {
    }
    public PerfilDocente(Long idDocente) {
        this.idDocente = idDocente;
    }

    //Getters y Setters / ToString
    public Long getIdDocente() {
        return idDocente;
    }
    public void setIdDocente(Long idDocente) {
        this.idDocente = idDocente;
    }
    public String getGradoAcademico() {
        return gradoAcademico;
    }
    public void setGradoAcademico(String gradoAcademico) {
        this.gradoAcademico = gradoAcademico;
    }
    public LocalDate getFechaContratacion() {
        return fechaContratacion;
    }
    public void setFechaContratacion(LocalDate fechaContratacion) {
        this.fechaContratacion = fechaContratacion;
    }
    public String getEstadoLaboral() {
        return estadoLaboral;
    }
    public void setEstadoLaboral(String estadoLaboral) {
        this.estadoLaboral = estadoLaboral;
    }
    
    public Usuarios getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Usuarios idUsuario) {
        this.idUsuario = idUsuario;
    }
    public Especialidades getIdEspecialidad() {
        return idEspecialidad;
    }
    public void setIdEspecialidad(Especialidades idEspecialidad) {
        this.idEspecialidad = idEspecialidad;
    }
    
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "PerfilDocente [idDocente=" + idDocente + ", gradoAcademico=" + gradoAcademico + ", fechaContratacion="
                + fechaContratacion + ", estadoLaboral=" + estadoLaboral + ", idUsuario=" + idUsuario
                + ", idEspecialidad=" + idEspecialidad + ", estado=" + estado + "]";
    }
}